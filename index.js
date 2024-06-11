
    const express = require('express');
    const fs = require('fs');
    const path = require('path');
    const PizZip = require('pizzip');
    const Docxtemplater = require('docxtemplater');
    const { Blob } = require('buffer');
    const { saveAs } = require('file-saver');

    const app = express();
    const PORT = 3000;

// Middleware pour servir les fichiers statiques
    app.use(express.static('public'));
    app.use(express.json());

// Route pour générer le fichier DOCX
    app.post('/generate-doc', async (req, res) => {
        const { prenom, nom, titre,responsable,description,ville,date } = req.body;

        const templatePath = path.join(__dirname, 'public', 'template.docx');
        if (!fs.existsSync(templatePath)) {
            return res.status(404).send('Template DOCX not found');
        }

        const content = fs.readFileSync(templatePath, 'binary');

        // Initialiser PizZip
        const zip = new PizZip(content);

        // Initialiser Docxtemplater
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        // Définir les valeurs des variables
        doc.setData({
            prenom: prenom,
            nom: nom,
            titre: titre,
            responsable:responsable,
            description: description,
            ville: ville,
            date: date
        });
        try {
            // Rendre le document avec les valeurs des variables
            doc.render();
        } catch (error) {
            console.error('Erreur lors du rendu du document :', error);
            return res.status(500).send('Erreur lors du rendu du document');
        }

        // Générer le fichier DOCX final
        const buf = doc.getZip().generate({
            type: 'nodebuffer',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });

        // Envoyer le fichier en tant que réponse
        res.set({
            'Content-Disposition': 'attachment; filename="output.docx"',
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });

        res.send(buf);
    });

// Démarrer le serveur
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });

