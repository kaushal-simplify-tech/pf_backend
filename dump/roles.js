const roles = [
    {
        name:"Super admin",
        identifier:"sp_admin",
        rights:['create', 'read','update','read_all'],
        modules:['Db','Pr','Pl','Co','Fe','An','Bt','CC']
    },
    {
        name:"Pocketfilm users",
        identifier:"pf_users",
        rights:['read'],
        modules:['Pl']
    }
]

module.exports = roles