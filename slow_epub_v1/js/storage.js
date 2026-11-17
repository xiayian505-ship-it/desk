/* Store entire editable projects locally. No data is sent to a server. */
(function () {
    "use strict";

    const database_name = "slow_epub_projects";
    const store_name = "books";
    let database_promise = null;

    function open_database() {
        if (database_promise) {
            return database_promise;
        }

        database_promise = new Promise((resolve, reject) => {
            const request = indexedDB.open(database_name, 1);

            request.onupgradeneeded = () => {
                if (!request.result.objectStoreNames.contains(store_name)) {
                    request.result.createObjectStore(store_name, { keyPath: "id" });
                }
            };

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        }).catch((error) => {
            database_promise = null;
            throw error;
        });

        return database_promise;
    }

    async function run_request(mode, execute) {
        const database = await open_database();

        return new Promise((resolve, reject) => {
            const transaction = database.transaction(store_name, mode);
            const object_store = transaction.objectStore(store_name);
            let result;

            try {
                result = execute(object_store);
            } catch (error) {
                reject(error);
                return;
            }

            transaction.oncomplete = () => resolve(result?.result);
            transaction.onerror = () => reject(transaction.error);
            transaction.onabort = () => reject(transaction.error);
        });
    }

    async function save_book(book) {
        await run_request("readwrite", (store) => store.put(book));
    }

    function get_book(id) {
        return run_request("readonly", (store) => store.get(id));
    }

    function get_all_books() {
        return run_request("readonly", (store) => store.getAll());
    }

    async function delete_book(id) {
        await run_request("readwrite", (store) => store.delete(id));
    }

    window.SlowProjectStorage = {
        open_database,
        save_book,
        get_book,
        get_all_books,
        delete_book
    };
}());
