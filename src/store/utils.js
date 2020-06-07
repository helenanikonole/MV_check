export const actions = {
    validateImage({}, file) {
        return new Promise ( (resolve, reject) => {    
            if (file.name.length === 0) {
                return reject('Ошибка! У файла нет имени')
            }
    
            if (file.size > 10485760) {
                return reject('Ошибка! Фото весит более 10 МБ')
            }

            if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
                return reject('Ошибка! Можно загружать файлы с расширением png или jpg')
            }

            resolve()
        })
    },
}
