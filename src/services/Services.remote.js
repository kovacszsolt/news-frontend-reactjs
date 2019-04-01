class ServicesRemote {
    static getAll = () => {
        return new Promise((resolve, reject) => {
            fetch(process.env.REACT_APP_SERVER + '/list')
                .then(res => res.json())
                .then(
                    (result) => {
                        resolve(result);
                    },
                    (error) => {
                    }
                )
        });
    };
    static getUpdate = () => {
        return new Promise((resolve, reject) => {
            fetch(process.env.REACT_APP_SERVER + '/update')
                .then(res => res.json())
                .then(
                    (result) => {
                        resolve(result);
                    },
                    (error) => {
                    }
                )
        });
    };
}

export default ServicesRemote;
