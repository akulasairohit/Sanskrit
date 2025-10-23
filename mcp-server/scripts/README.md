# Scripts

Utility scripts for running and managing the Sanskrit MCP server.

## Available Scripts

### `run-server.sh`
Starts the MCP server in STDIO mode.

```bash
./scripts/run-server.sh
```

Use with MCP Inspector:
```bash
npx @modelcontextprotocol/inspector ./scripts/run-server.sh
```

### `run-debate.sh`
Runs a philosophical debate between Vedanta schools.

```bash
./scripts/run-debate.sh
```

### `setup.sh`
Initial setup script for dependencies and environment.

```bash
./scripts/setup.sh
```

## Usage from Package Scripts

These scripts are also available via npm:

```bash
npm run inspector  # Launch MCP Inspector
npm run setup      # Run setup script
```

## Making Scripts Executable

If scripts lose executable permissions:

```bash
chmod +x scripts/*.sh
```
