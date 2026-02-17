---
title: SSH Tunnels
description: Connect to remote databases through SSH tunnels.
---

Use SSH tunnels to reach databases behind firewalls, on private networks, or accessible only through a bastion/jump server.

## Setting up an SSH tunnel

1. Open the connection form for your database.
2. Enable the **SSH Tunnel** toggle.
3. Fill in the SSH settings:

| Field | Description | Default |
| --- | --- | --- |
| SSH Host | Hostname or IP of the SSH server | — |
| SSH Port | SSH port | `22` |
| SSH Username | Your SSH user | — |

## Authentication methods

### Password

Enter your SSH password. Seaquel stores it in the system keychain.

### SSH key

1. Select **Key** as the authentication method.
2. Provide the path to your private key file (e.g., `~/.ssh/id_rsa` or `~/.ssh/id_ed25519`).
3. If your key is encrypted, enter the passphrase. It's stored securely in the keychain.

## How it works

Seaquel creates a local port forward automatically. Your database connection is routed through the SSH tunnel — the database host and port in your connection settings refer to the address as seen from the SSH server, not your local machine.

## Common setup

**Remote database behind a firewall:**

- SSH Host: your bastion server
- Database Host: the private IP of your database (e.g., `10.0.1.50`)
- Database Port: `5432` (or whatever your database uses)

Seaquel handles the tunnel lifecycle — it opens when you connect and closes when you disconnect.
