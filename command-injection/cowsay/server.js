const http = require("http");
const { exec } = require("child_process");
const cowsay = require("cowsay");

const PORT = 3000;

const server = http.createServer((req, res) => {
    console.log("\n========================================");
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    console.log(`[TIME] ${new Date().toISOString()}`);

    const url = new URL(req.url, `http://${req.headers.host}`);
    const say = url.searchParams.get("say");

    console.log(`[PARAMETER] say = ${say}`);

    res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8"
    });

    if (!say) {
        res.end(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <title>Command Injection Lab</title>
            </head>
            <body>
                <h1>Command Injection Lab</h1>

                <form method="GET">
                    <label>Entrada:</label>
                    <input type="text" name="say">
                    <button type="submit">Executar</button>
                </form>

                <p>Exemplo:</p>
                <code>?say=hello</code>
            </body>
            </html>
        `);

        return;
    }

    const command = `cowsay "${say}"`;

    console.log(`[COMMAND] ${command}`);

    exec(command, (error, stdout, stderr) => {
        console.log("[STDOUT]");
        console.log(stdout);

        console.log("[STDERR]");
        console.log(stderr);

        if (error) {
            console.log(`[ERROR] ${error.message}`);
        }

        const output = stdout || stderr || error?.message || "";

        res.end(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <title>Command Injection Lab</title>

                <style>
                    body {
                        font-family: monospace;
                        background: #111;
                        color: #eee;
                        padding: 30px;
                    }

                    input {
                        padding: 8px;
                        width: 400px;
                    }

                    button {
                        padding: 8px 15px;
                    }

                    pre {
                        background: #000;
                        padding: 20px;
                        overflow-x: auto;
                    }

                    .warning {
                        color: #ff5555;
                    }
                </style>
            </head>

            <body>
                <h1>Command Injection Lab</h1>

                <p class="warning">
                    Ambiente propositalmente vulnerável.
                </p>

                <form method="GET">
                    <input
                        type="text"
                        name="say"
                        value="${say.replace(/"/g, "&quot;")}"
                    >

                    <button type="submit">
                        Executar
                    </button>
                </form>

                <h2>Resultado</h2>

                <pre>${output
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")}</pre>

            </body>
            </html>
        `);
    });
});

server.listen(PORT, () => {
    console.log("========================================");
    console.log(" Command Injection Lab");
    console.log("========================================");
    console.log(`[SERVER] http://localhost:${PORT}`);
    console.log(`[PID] ${process.pid}`);
    console.log(`[USER] Processo executado pelo usuário do SO`);
    console.log("[VERBOSE] Servidor iniciado...");
});
