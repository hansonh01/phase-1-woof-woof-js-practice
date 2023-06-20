const localhost = 'http://localhost:3000/pups';

let fetchedDogs = [];

function getPupsApi(){
    fetch(localhost)
    .then(resp=>resp.json())
    .then((dogs)=>{
        dogsCard(dogs);
        fetchedDogs = dogs;
        document.getElementById('good-dog-filter').addEventListener('click',filterGoodDogs);
    })
}

function dogsCard(dogs){
    const dogsBar = document.getElementById('dog-bar');
    dogsBar.innerHTML = '';
    dogs.forEach(dog=>{
        const dogSpan = document.createElement('span')
        dogSpan.textContent = dog.name;
        dogSpan.addEventListener('click',()=>dogInfos(dog))

        dogsBar.appendChild(dogSpan);
    })
}

function dogInfos(dog){
    const dogInfo = document.getElementById('dog-info');
    dogInfo.innerHTML = '';

    const dogImg = document.createElement('img');
    dogImg.src = dog.image
    dogInfo.appendChild(dogImg);

    const dogh2 = document.createElement('h2');
    dogh2.textContent = dog.name;
    dogInfo.appendChild(dogh2);

    const dogButton = document.createElement('button');
    dogButton.textContent = dog.isGoodDog ? 'Good Dog!':'Bad Dog!';
    dogButton.addEventListener('click',()=>goodBadToggle(dog))
    dogInfo.appendChild(dogButton);
}

function goodBadToggle(dog){

    fetch(`${localhost}/${dog.id}`,{
        method:'PATCH',
        headers:{
            'Content-Type':'application/json',
            'Accept':'application/json'
        },
        body: JSON.stringify({
            'isGoodDog': !dog.isGoodDog
        })
    })
    .then(resp=>resp.json)
    .then(data => {
        const dogButton = document.querySelector('#dog-info button');
        dogButton.textContent = dog.isGoodDog ? 'Bad Dog!' : 'Good Dog!';
        dog.isGoodDog = data.isGoodDog;
    })
}

function filterGoodDogs(){
    const filterButton = document.getElementById('good-dog-filter');
    const filterOff = filterButton.textContent.includes('OFF');
    const dogBar = document.getElementById('dog-bar');
    const dogSpans = dogBar.getElementsByTagName('span');
    const switches = {
        'Filter good dogs: OFF':'Filter good dogs: ON',
        'Filter good dogs: ON':'Filter good dogs: OFF'
    }
    filterButton.textContent = switches[filterButton.textContent];
    if (filterOff) {
        for (const span of dogSpans) {
          const dogName = span.textContent;
          const dog = fetchedDogs.find(d => d.name === dogName);
    
          if (dog && !dog.isGoodDog) {
            span.style.display = 'none';
          } else {
            span.style.display = '';
          }
        }
      } else {
        for (const span of dogSpans) {
          span.style.display = '';
        }
      }
}

document.addEventListener('DOMContentLoaded',getPupsApi);