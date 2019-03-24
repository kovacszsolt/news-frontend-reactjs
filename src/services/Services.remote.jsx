class ServicesRemote {
    static getAll = () => {
        return new Promise((resolve, reject) => {
            fetch('https://itcrowd.hu/backend/list')
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
