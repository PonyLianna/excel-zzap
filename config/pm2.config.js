module.exports = {
    "apps": [
        {
            "name": "excel-zzap",
            "script": "../start.js",
            "instances": "1",
            "out_file": "/dev/null",
            "error_file": "/dev/null",
            "env": {
                "NODE_ENV": "development",
                "PORT": 4000
            }
        }
    ]
};
