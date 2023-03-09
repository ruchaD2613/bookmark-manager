import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getFirestore, getDocs, collection, addDoc, deleteDoc, doc, serverTimestamp, query, where} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyBVXzek71cw0MJxQqAM_QpHPede8gx8xXA",
    authDomain: "bookmark-9197e.firebaseapp.com",
    projectId: "bookmark-9197e",
    storageBucket: "bookmark-9197e.appspot.com",
    messagingSenderId: "603899822585",
    appId: "1:603899822585:web:737c5402c6d44602bcfd28"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const colRef = collection(db, "bookmarks");

function deleteEvent(){
    const deleteButtons = document.querySelectorAll("i.delete");
    deleteButtons.forEach(button => {
        button.addEventListener("click", event => {
            const deleteRef = doc(db, "bookmarks", button.dataset.id);
            deleteDoc(deleteRef)
                .then(() => {
                    button.parentElement.parentElement.parentElement.remove();
                })
        })
    });
}

function generateTemplate(response, id){
    return `<div class="card">
                <p class="title">${response.title}</p>
                <div class="sub-info">
                    <p>
                        <span class="category ${response.category}"><img src="Logo/${response.category}.png" alt=""></span>
                    </p>
                    <a href="${response.link}" target="_blank"><i class="bi bi-box-arrow-up-right website"></i></a>
                    <a href="https://www.google.com/search?q=${response.title}" target="_blank"><i class="bi bi-google search"></i></a>
                    <span><i class="bi bi-trash delete" data-id="${id}"></i></span>
                </div>       
            </div>`
}

const cards = document.querySelector(".cards");

function showCard(){
    cards.innerHTML = "";
    getDocs(colRef)
        .then(data => {
            data.docs.forEach(document => {
                cards.innerHTML += generateTemplate(document.data(), document.id);
            })
            deleteEvent();
        })
        .catch(error => {
            console.log(error);
        })
}
showCard();

const addForm = document.querySelector(".add");
addForm.addEventListener("submit", event => {
    event.preventDefault();

    addDoc(colRef, {
        link: addForm.link.value,
        title: addForm.title.value,
        category: addForm.category.value,
        createdAt: serverTimestamp()
    })
    .then(() => {
        addForm.reset();
        showCard();
    });
});

function filterCards(category){
    if (category == "all"){
        showCard();
    } else {
        const q = query(colRef, where("category", "==",  category));
        cards.innerHTML = "";
        getDocs(q)
            .then(data => {
                data.docs.forEach(document => {
                    cards.innerHTML += generateTemplate(document.data(), document.id);
                })
                deleteEvent();
            })
            .catch(error => {
                console.log(error);
            })
    }
}
    
const catSpan = document.querySelectorAll(".category-list span");
const categoryList = document.querySelector(".category-list");
categoryList.addEventListener("click", event => {
    if (event.target.tagName == "SPAN"){
        filterCards(event.target.innerText.toLowerCase())
        catSpan.forEach(cat => {
            cat.classList.remove("active");
        })
        event.target.classList.add("active");
    }
})