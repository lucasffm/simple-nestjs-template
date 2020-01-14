# How to config Gitlab CI with PM2 on VPS:

## Install Gitlab Runner:

    curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh | sudo bash
    sudo apt-get install gitlab-runner

## SSH Config:
 Generate SSH Key on Remote Server With user "gitlab-runner"
paste id_rsa.pub on `"Settings" => "Repository" => "Deploy Keys"`
check your permissions using `ssh -Tv git@gitlab.com command`

## Install Docker

    sudo apt install apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
    sudo apt update
    sudo apt install docker-ce
    
## Executing the Docker Command Without Sudo


By default, the docker command can only be run the root user or by a user in the docker group, which is automatically created during Docker’s installation process. If you attempt to run the docker command without prefixing it with sudo or without being in the docker group, you’ll get an output like this:

    sudo usermod -aG docker ${USER}

To apply the new group membership, log out of the server and back in, or type the following:

    su - ${USER}

You will be prompted to enter your user’s password to continue.

Confirm that your user is now added to the docker group by typing:

    id -nG
    Output
    sammy sudo docker

If you need to add a user to the docker group that you’re not logged in as, declare that username explicitly using:

    sudo usermod -aG docker username

The rest of this article assumes you are running the docker command as a user in the docker group. If you choose not to, please prepend the commands with sudo.

Let’s explore the docker command next.

## Disable direct push to branch master



