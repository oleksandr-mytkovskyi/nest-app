const path = require("path");
const fs = require('fs');
const publicUrlA = path.resolve('./src/auth/sshKey/publicKeyA');
const privatUrlA = path.resolve('./src/auth/sshKey/privatKeyA');
const publicUrlR = path.resolve('./src/auth/sshKey/publicKeyR');
const privatUrlR = path.resolve('./src/auth/sshKey/privatKeyR');

const getKey = (url) => {
    return fs.readFileSync(url, 'utf8');   
}

const publickKeyAccess = process.env.publicKeyA ? process.env.publicKeyA : getKey(publicUrlA);
const privatKeyAccess = process.env.publicKeyA ? process.env.privatKeyA : getKey(privatUrlA);

const publickKeyRefresh = process.env.publicKeyA ? process.env.publicKeyR : getKey(publicUrlR);
const privatKeyRefresh = process.env.publicKeyA ? process.env.privatKeyR : getKey(privatUrlR);

export const jwtConstants = {
    secretPublickAccess: publickKeyAccess,
    secretPrivatkAccess: privatKeyAccess,
    expiresInAccess: '1h',
    secretPublickRefresh: publickKeyRefresh,
    secretPrivatkRefresh: privatKeyRefresh,
    expiresInRefresh: '30d',
};

export const roles = {
    admin: 1,
    user: 2
}




