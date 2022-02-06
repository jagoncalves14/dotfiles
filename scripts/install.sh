#!/usr/bin/env bash
############################
# This script creates symlinks from the home directory to any desired dotfiles in ${homedir}/dotfiles
# And also installs Homebrew Packages
############################

# Exit as soon as a command fails
set -e

# Accessing an empty variable will yield an error
set -u

# Set dotfiles directory
DOTFILE_DIRECTORY="$HOME/Projects/dotfiles/files"

# Set list of files/folders to symlink in the home directory
DOTFILES_ARRAY=(".zshrc" ".oh-my-zsh" ".nvm" ".p10k.zsh" ".vimrc" ".vscode" ".gitconfig" ".config" ".macos")

# Download Git Auto-Completion
curl "https://raw.githubusercontent.com/git/git/master/contrib/completion/git-completion.bash" > "$HOME/.git-completion.bash"

# Run the Homebrew Script
bash "$DOTFILE_DIRECTORY/scripts/brew.sh"


# Get into files directory
cd ${DOTFILE_DIRECTORY}

# Create symlinks (will overwrite old dotfiles)
for file in "${DOTFILES_ARRAY[@]}"; do
    ln -sf "$file" "$HOME/$file"
    echo "Created symlink to $file in home directory."
done

# Copy hosts file
rsync -a "hosts" "/etc/hosts"

echo "Completed."