class ServicesRemote {
    static getAll = () => {
        return new Promise((resolve, reject) => {
            fetch(process.env.REACT_APP_SERVER_LIST_URL)
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
