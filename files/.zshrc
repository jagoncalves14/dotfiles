# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# If you come from bash you might have to change your $PATH.
export PATH=/usr/local/share/npm/bin:$PATH

# Path to your oh-my-zsh installation.
export ZSH=/Users/joaogoncalves/.oh-my-zsh

# Theme
ZSH_THEME="powerlevel10k/powerlevel10k"

# Which plugins would you like to load? (plugins can be found in ~/.oh-my-zsh/plugins/*)
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
plugins=(
  git
  docker
  docker-composer
  auto-notify
  zsh-autosuggestions
)

source $ZSH/oh-my-zsh.sh

# Active aliases
alias pixelwebsite-deploy="ansible-playbook -i hosts deploy.yml"
alias ..="cd .."
alias ...="cd ../.."
alias ....="cd ../../.."
alias .....="cd ../../../.."
alias ......="cd ../../../../.."
alias copysshkey="pbcopy < ~/.ssh/id_rsa.pub"
alias copypersonalsshkey="pbcopy < ~/.ssh/personalAccount.pub"
alias resetnpm="rm -rf node_modules && npm i"
alias cjmockserver="gitstashapply cjmockserver"
alias gitreset="git clean -fd && git reset --hard HEAD"

# Function Aliases
function gitstashapply() {
    git stash apply $(git stash list | grep "$1" | cut -d: -f1)
}

# Load NVM
export NVM_DIR="/Users/joaogoncalves/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Add RVM to PATH for scripting. Make sure this is the last PATH variable change.
export PATH="$PATH:$HOME/.rvm/bin"
export PATH="/usr/local/opt/openssl/bin:$PATH"
export PATH="/usr/local/opt/icu4c/bin:$PATH"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
