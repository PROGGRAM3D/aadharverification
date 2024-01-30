require("msnodesqlv8");
const config = {
    server : "DESKTOP-T2QA7PE\\MSSQLSERVER01",
    database: "dappDB",
    driver : "msnodesqlv8",
    options : {
        trustServerCertificate : true,
        trustedConnection : true,
        enableArithAbort: true,
        encrypt: false
    },
    
    port : 1433
}

module.exports = config