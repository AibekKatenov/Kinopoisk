function saveToWatch(id){
    axios.post('/api/films/save', {id}).then(data => {
        alert(data.data)
        location.reload()
    })
}


function deleteFilmFromToWatch(id){
    axios.delete(`/api/films/save/${id}`, {id}).then(data => {
        if(data.status == 200){
            alert(data.data)
            location.reload() 
        }
    })
}