// Variables para almacenar los datos de preguntas y respuestas
let questions = [];
let uploadedFiles = [];

// Manejar la subida de archivos
document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('fileInput');
    const urlInput = document.getElementById('urlInput');

    // Procesar archivos subidos
    if (fileInput.files.length > 0) {
        for (const file of fileInput.files) {
            const fileType = file.type;
            if (fileType === 'application/pdf') {
                // Leer PDF usando PDF.js
                await readPdf(file);
            } else {
                alert('Solo se permiten archivos PDF.');
            }
        }
    }

    // Procesar enlaces web (aquí se puede añadir lógica para descargar y analizar el contenido del enlace)
    if (urlInput.value) {
        const url = urlInput.value;
        // Puedes añadir código para manejar enlaces web aquí, si es necesario
        alert('Los enlaces web aún no están soportados.');
    }

    // Mostrar preguntas en el formulario
    displayQuestions();
});

// Leer y procesar el archivo PDF
async function readPdf(file) {
    const pdfjsLib = window['pdfjs-dist/build/pdf'];

    try {
        const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
        const numPages = pdf.numPages;
        let textContent = '';

        for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const text = await page.getTextContent();
            text.items.forEach(item => {
                textContent += item.str + ' ';
            });
        }

        // Procesar el contenido del PDF para extraer preguntas y respuestas
        processTextContent(textContent);
    } catch (error) {
        console.error('Error al leer el archivo PDF:', error);
    }
}

// Procesar el texto extraído del PDF
function processTextContent(textContent) {
    // Aquí debes implementar la lógica para extraer preguntas y respuestas
    // Ejemplo de datos estáticos para ilustrar
    questions = [
        { question: '¿Cuál es el tema de la primera pregunta?', options: ['A', 'B', 'C'], correct: 'A' },
        { question: '¿Cuál es el tema de la segunda pregunta?', options: ['D', 'E', 'F'], correct: 'E' }
    ];

    displayQuestions();
}

// Mostrar preguntas en el formulario
function displayQuestions() {
    const form = document.getElementById('questionForm');
    form.innerHTML = '';

    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');

        const questionLabel = document.createElement('label');
        questionLabel.textContent = q.question;
        questionDiv.appendChild(questionLabel);

        q.options.forEach(option => {
            const optionInput = document.createElement('input');
            optionInput.type = 'radio';
            optionInput.name = `question_${index}`;
            optionInput.value = option;
            optionInput.id = `question_${index}_${option}`;
            
            const optionLabel = document.createElement('label');
            optionLabel.setAttribute('for', `question_${index}_${option}`);
            optionLabel.textContent = option;

            questionDiv.appendChild(optionInput);
            questionDiv.appendChild(optionLabel);
        });

        form.appendChild(questionDiv);
    });
}

// Calcular el puntaje basado en las respuestas
document.getElementById('calculateScore').addEventListener('click', function() {
    const form = document.getElementById('questionForm');
    let score = 0;

    questions.forEach((q, index) => {
        const selectedOption = form.querySelector(`input[name="question_${index}"]:checked`);
        if (selectedOption) {
            const answer = selectedOption.value;
            if (answer === q.correct) {
                score += 4.079; // Puntaje por respuesta correcta en el área de conocimientos
            } else {
                score -= 1.021; // Penalización por respuesta incorrecta en el área de conocimientos
            }
        }
    });

    // Mostrar el resultado del puntaje
    const scoreResult = document.getElementById('scoreResult');
    scoreResult.textContent = `Tu puntaje es: ${score.toFixed(2)}`;
});
