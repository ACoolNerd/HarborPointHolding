#!/usr/bin/env python3
import os
import sys
from ftplib import FTP

# Configurable excluded directories/files
EXCLUDE_DIRS = {'.git', '.github', 'node_modules', 'scratch'}
EXCLUDE_FILES = {'.gitignore', 'Dockerfile', 'docker-compose.yml', 'package.json', 'package-lock.json', 'leads.json'}

def load_env():
    """Simple parser for a local .env file"""
    env = {}
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    env[k.strip()] = v.strip().strip('"').strip("'")
    return env

def main():
    print("====================================================")
    print("HARBOR POINT HOLDING — FTP DEPLOYMENT CLI")
    print("====================================================")
    
    # Load settings from environment or .env file
    env = load_env()
    host = os.environ.get('FTP_HOST') or env.get('FTP_HOST')
    user = os.environ.get('FTP_USER') or env.get('FTP_USER')
    passwd = os.environ.get('FTP_PASS') or env.get('FTP_PASS')
    remote_dir = os.environ.get('FTP_DIR') or env.get('FTP_DIR') or '/'

    if not host or not user or not passwd:
        print("\n[Error] Missing FTP credentials!")
        print("Please configure them in a local .env file at the project root:")
        print("----------------------------------------------------")
        print("FTP_HOST=ftp.yourdomain.com")
        print("FTP_USER=your_ftp_username")
        print("FTP_PASS=your_ftp_password")
        print("FTP_DIR=/public_html   # (optional, defaults to '/')")
        print("----------------------------------------------------")
        sys.exit(1)

    print(f"Connecting to FTP host: {host}...")
    try:
        ftp = FTP(host)
        ftp.login(user, passwd)
        print("Login successful.")
    except Exception as e:
        print(f"[Error] Failed to connect/login: {e}")
        sys.exit(1)

    # Change to target remote directory
    try:
        if remote_dir != '/':
            # Attempt to create directory if not exists
            for folder in filter(None, remote_dir.split('/')):
                try:
                    ftp.cwd(folder)
                except:
                    ftp.mkd(folder)
                    ftp.cwd(folder)
            print(f"Changed remote directory to: {ftp.pwd()}")
        else:
            print("Deploying to remote root directory.")
    except Exception as e:
        print(f"[Error] Failed to navigate to remote directory: {e}")
        ftp.quit()
        sys.exit(1)

    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    print("\nScanning local files for deployment...")
    files_to_upload = []
    for root, dirs, files in os.walk(project_root):
        # Filter out directories
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith('.')]
        
        for file in files:
            if file in EXCLUDE_FILES or file.startswith('.'):
                continue
            
            local_path = os.path.join(root, file)
            rel_path = os.path.relpath(local_path, project_root)
            files_to_upload.append((local_path, rel_path))

    print(f"Found {len(files_to_upload)} files to deploy.")
    print("----------------------------------------------------")

    success_count = 0
    for local_path, rel_path in files_to_upload:
        remote_path = rel_path.replace(os.path.sep, '/')
        remote_dir_path = os.path.dirname(remote_path)

        # Ensure remote directories exist
        if remote_dir_path:
            # Save current directory
            orig_dir = ftp.pwd()
            for part in filter(None, remote_dir_path.split('/')):
                try:
                    ftp.cwd(part)
                except:
                    print(f"Creating remote folder: {part}")
                    ftp.mkd(part)
                    ftp.cwd(part)
            # Restore to base dir
            while ftp.pwd() != orig_dir:
                ftp.cwd('..')

        # Upload file binary-wise
        print(f"Uploading: {remote_path}...", end="", flush=True)
        try:
            with open(local_path, 'rb') as f:
                ftp.storbinary(f'STOR {remote_path}', f)
            print(" [OK]")
            success_count += 1
        except Exception as e:
            print(f" [FAILED: {e}]")

    print("----------------------------------------------------")
    print(f"Deployment complete. {success_count}/{len(files_to_upload)} files uploaded successfully.")
    
    ftp.quit()

if __name__ == '__main__':
    main()
