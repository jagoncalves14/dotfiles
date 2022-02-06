#!/bin/bash

################################################################################
#
# Shell script to copy important configuration files from the current
# environment to this repository.
#
################################################################################

# Exit as soon as a command fails
set -e

# Accessing an empty variable will yield an error
set -u

REPO_PATH="$PWD/files/"

# Adjust destination paths for dotfiles
DOTFILES_ARRAY=("$HOME/.zshrc" "$HOME/.oh-my-zsh" "$HOME/.nvm" "$HOME/.p10k.zsh" "$HOME/.vimrc" "$HOME/.vscode" "$HOME/.gitconfig" "$HOME/.config" "$HOME/.macos" "/etc/hosts")

# Update repository with new updated files
for file in "${DOTFILES_ARRAY[@]}"; do
    rsync -a "$file" "$REPO_PATH"
    echo "Copied $file to repository folder"
done

echo "Completed."