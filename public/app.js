async function generateDoc() {
    const prenom = document.querySelector('#inputPrenom').value;
    const nom = document.querySelector('#inputNom').value
    const titre = document.querySelector('#inputTitre').value
    const responsable = document.querySelector('#inputResponsable').value
    const description = document.querySelector('#inputDescription').value
    const ville = document.querySelector('#inputVille').value
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const date = dd + '/' + mm + '/' + yyyy
    const response = await axios.post('/generate-doc', {
        prenom: prenom,
        nom: nom,
        titre: titre,
        responsable: responsable,
        description: description,
        ville: ville,
        date: date
    }, {
        responseType: 'blob'
    });
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'certificat.docx';
    link.click();
}