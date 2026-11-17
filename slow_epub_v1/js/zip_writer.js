/*
 * ZIP32 writer for this tool's EPUB export.
 *
 * EPUB allows uncompressed (STORE) ZIP entries. A small ZIP writer avoids
 * loading a third-party library and keeps the generated e-book offline.
 * Limits: entries and archive must stay below ZIP32's 4 GiB limits.
 */
(function () {
    "use strict";

    const text_encoder = new TextEncoder();
    const crc_table = new Uint32Array(256);

    for (let index = 0; index < 256; index += 1) {
        let checksum = index;

        for (let bit = 0; bit < 8; bit += 1) {
            checksum = (checksum & 1)
                ? (0xEDB88320 ^ (checksum >>> 1))
                : (checksum >>> 1);
        }

        crc_table[index] = checksum >>> 0;
    }

    function calculate_crc32(bytes) {
        let checksum = 0xFFFFFFFF;

        for (const byte of bytes) {
            checksum = crc_table[(checksum ^ byte) & 0xFF] ^ (checksum >>> 8);
        }

        return (checksum ^ 0xFFFFFFFF) >>> 0;
    }

    function write_uint16(view, offset, value) {
        view.setUint16(offset, value, true);
    }

    function write_uint32(view, offset, value) {
        view.setUint32(offset, value, true);
    }

    function concatenate_arrays(chunks, total_length) {
        const result = new Uint8Array(total_length);
        let offset = 0;

        for (const chunk of chunks) {
            result.set(chunk, offset);
            offset += chunk.length;
        }

        return result;
    }

    function create_zip(files) {
        if (files.length === 0 || files.length > 65535) {
            throw new Error("ZIP 檔案數量超出限制。");
        }

        const chunks = [];
        const directory_chunks = [];
        let current_offset = 0;
        let directory_length = 0;

        for (const file of files) {
            const filename_bytes = text_encoder.encode(file.name);
            const content_bytes = typeof file.content === "string"
                ? text_encoder.encode(file.content)
                : file.content;

            if (!(content_bytes instanceof Uint8Array)) {
                throw new Error("ZIP 內容必須是文字或 Uint8Array。");
            }

            if (filename_bytes.length > 65535 || content_bytes.length >= 0xFFFFFFFF) {
                throw new Error("ZIP 檔案過大。");
            }

            const crc32 = calculate_crc32(content_bytes);
            const entry_offset = current_offset;
            const is_ascii = filename_bytes.every((byte) => byte < 128);
            const general_flag = is_ascii ? 0 : 0x0800;

            // 30-byte local header, followed by UTF-8 filename and raw bytes.
            const local_header = new Uint8Array(30);
            const local_view = new DataView(local_header.buffer);
            write_uint32(local_view, 0, 0x04034B50);
            write_uint16(local_view, 4, 10);
            write_uint16(local_view, 6, general_flag);
            write_uint16(local_view, 8, 0); // STORE, no compression
            write_uint16(local_view, 10, 0);
            write_uint16(local_view, 12, 0);
            write_uint32(local_view, 14, crc32);
            write_uint32(local_view, 18, content_bytes.length);
            write_uint32(local_view, 22, content_bytes.length);
            write_uint16(local_view, 26, filename_bytes.length);
            write_uint16(local_view, 28, 0); // no extra field; mandatory for mimetype

            chunks.push(local_header, filename_bytes, content_bytes);
            current_offset += local_header.length + filename_bytes.length + content_bytes.length;

            const central_header = new Uint8Array(46);
            const central_view = new DataView(central_header.buffer);
            write_uint32(central_view, 0, 0x02014B50);
            write_uint16(central_view, 4, 10);
            write_uint16(central_view, 6, 10);
            write_uint16(central_view, 8, general_flag);
            write_uint16(central_view, 10, 0);
            write_uint16(central_view, 12, 0);
            write_uint16(central_view, 14, 0);
            write_uint32(central_view, 16, crc32);
            write_uint32(central_view, 20, content_bytes.length);
            write_uint32(central_view, 24, content_bytes.length);
            write_uint16(central_view, 28, filename_bytes.length);
            write_uint16(central_view, 30, 0);
            write_uint16(central_view, 32, 0);
            write_uint16(central_view, 34, 0);
            write_uint16(central_view, 36, 0);
            write_uint32(central_view, 38, 0);
            write_uint32(central_view, 42, entry_offset);

            directory_chunks.push(central_header, filename_bytes);
            directory_length += central_header.length + filename_bytes.length;
        }

        const end_header = new Uint8Array(22);
        const end_view = new DataView(end_header.buffer);
        write_uint32(end_view, 0, 0x06054B50);
        write_uint16(end_view, 4, 0);
        write_uint16(end_view, 6, 0);
        write_uint16(end_view, 8, files.length);
        write_uint16(end_view, 10, files.length);
        write_uint32(end_view, 12, directory_length);
        write_uint32(end_view, 16, current_offset);
        write_uint16(end_view, 20, 0);

        const output_size = current_offset + directory_length + end_header.length;

        if (output_size >= 0xFFFFFFFF) {
            throw new Error("電子書超過 ZIP32 的大小限制。");
        }

        const output = concatenate_arrays(
            [...chunks, ...directory_chunks, end_header],
            output_size
        );

        return new Blob([output], { type: "application/epub+zip" });
    }

    window.SlowZipWriter = { create_zip };
}());
