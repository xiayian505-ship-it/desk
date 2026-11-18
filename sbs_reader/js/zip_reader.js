"use strict";

/**
 * 從 ZIP 中央目錄直接讀 EPUB，不依賴第三方函式庫。
 * 支援一般 ZIP 的 STORE（0）與 DEFLATE（8）。
 * DEFLATE 透過瀏覽器原生 DecompressionStream 解壓。
 * 不支援加密 ZIP、ZIP64 與多磁碟 ZIP。
 */
class LocalZipReader {
    constructor(array_buffer) {
        this.bytes = new Uint8Array(array_buffer);
        this.data_view = new DataView(array_buffer);
        this.entries = new Map();
        this.decoded_files = new Map();
        this.read_central_directory();
    }

    read_central_directory() {
        const view = this.data_view;
        const search_start = Math.max(0, this.bytes.length - 65557);
        let directory_end = -1;

        for (let position = this.bytes.length - 22; position >= search_start; position -= 1) {
            if (view.getUint32(position, true) === 0x06054b50) {
                directory_end = position;
                break;
            }
        }

        if (directory_end < 0) {
            throw new Error("這不是有效的 EPUB／ZIP 檔案。");
        }

        const entry_count = view.getUint16(directory_end + 10, true);
        let offset = view.getUint32(directory_end + 16, true);

        if (entry_count === 0xffff || offset === 0xffffffff) {
            throw new Error("目前不支援 ZIP64 格式。");
        }

        for (let index = 0; index < entry_count; index += 1) {
            if (view.getUint32(offset, true) !== 0x02014b50) {
                throw new Error("ZIP 中央目錄格式錯誤。");
            }

            const flags = view.getUint16(offset + 8, true);
            const compression_method = view.getUint16(offset + 10, true);
            const compressed_size = view.getUint32(offset + 20, true);
            const name_length = view.getUint16(offset + 28, true);
            const extra_length = view.getUint16(offset + 30, true);
            const comment_length = view.getUint16(offset + 32, true);
            const local_offset = view.getUint32(offset + 42, true);
            const filename_bytes = this.bytes.subarray(offset + 46, offset + 46 + name_length);
            const filename = new TextDecoder("utf-8").decode(filename_bytes);

            if (flags & 0x1) {
                throw new Error("不支援加密的 EPUB。");
            }

            this.entries.set(filename, {
                compression_method,
                compressed_size,
                local_offset
            });

            offset += 46 + name_length + extra_length + comment_length;
        }
    }

    has(path) {
        return this.entries.has(path);
    }

    async read_bytes(path) {
        if (this.decoded_files.has(path)) {
            return this.decoded_files.get(path);
        }

        const entry = this.entries.get(path);

        if (!entry) {
            throw new Error(`EPUB 缺少檔案：${path}`);
        }

        const offset = entry.local_offset;

        if (this.data_view.getUint32(offset, true) !== 0x04034b50) {
            throw new Error(`ZIP 檔案表頭錯誤：${path}`);
        }

        const name_length = this.data_view.getUint16(offset + 26, true);
        const extra_length = this.data_view.getUint16(offset + 28, true);
        const data_start = offset + 30 + name_length + extra_length;
        const compressed_bytes = this.bytes.subarray(
            data_start,
            data_start + entry.compressed_size
        );
        let output;

        if (entry.compression_method === 0) {
            output = compressed_bytes;
        } else if (entry.compression_method === 8) {
            if (typeof DecompressionStream === "undefined") {
                throw new Error("這個瀏覽器不支援 EPUB 解壓，請使用新版 Chrome。");
            }

            try {
                const compressed_stream = new Blob([compressed_bytes]).stream();
                const decompressed_stream = compressed_stream.pipeThrough(
                    new DecompressionStream("deflate-raw")
                );
                output = new Uint8Array(await new Response(decompressed_stream).arrayBuffer());
            } catch (error) {
                throw new Error(`解壓失敗：${path}。請使用支援 deflate-raw 的新版瀏覽器。`);
            }
        } else {
            throw new Error(`EPUB 使用尚未支援的壓縮方式：${entry.compression_method}`);
        }

        this.decoded_files.set(path, output);
        return output;
    }

    async read_text(path) {
        const bytes = await this.read_bytes(path);
        return new TextDecoder("utf-8").decode(bytes);
    }
}
