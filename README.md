# koppie

`koppie` is a cross-device clipboard sharing CLI. Send text from one device, retrieve it on another with a short code, and optionally copy the result straight to the system clipboard.

## Installation

```bash
npm install -g koppie
```

## Usage

Send text and get a code back:

```bash
koppie send "hello world"
```

Send multiline text interactively:

```bash
koppie send
```

Paste text, then finish input with `Ctrl+D`.

Retrieve a paste and copy it to the clipboard:

```bash
koppie 4829
```

View a paste without copying it:

```bash
koppie view 7737
```

Delete a paste:

```bash
koppie delete 1234
```

Show help:

```bash
koppie --help
```

## API Configuration

`koppie` talks to the clipboard API at:

```text
https://api.freecodetools.dev
```

Override it with:

```bash
export KOPPIE_API_URL="https://your-api.example.com"
```

## Codes

Paste codes are numeric only and always 4 digits long.

Validation regex:

```text
^[0-9]{4}$
```

Examples:

```text
0007
0042
1234
9999
```

## Expiration

`send` supports an optional expiration flag:

```bash
koppie send --expire 1h "temporary paste"
koppie send --expire 1d "daily paste"
koppie send --expire 7d "weekly paste"
```

The request body includes the selected expiration value.

## Behavior

- `koppie send "text"` uploads text and prints only the returned code.
- `koppie send` reads multiline input from the terminal.
- `koppie <code>` fetches the paste, copies it to the system clipboard when possible, and shows the content if clipboard access fails.
- `koppie view <code>` prints the content to the terminal.
- `koppie delete <code>` deletes the paste and prints `Deleted`.

## Error Handling

The CLI surfaces friendly messages for common failures, including:

- invalid code
- network errors
- API errors
- clipboard errors
- empty content

Examples:

```text
✗ Code not found
✗ Network error
✗ Clipboard unavailable
✗ Empty content
```