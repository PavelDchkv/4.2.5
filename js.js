const mainBlock = document.querySelector('.search-line');
const searchBlock = mainBlock.querySelector('.search-line__input-wrapper');
const inputLine = searchBlock.querySelector('.search-line__input');

inputLine.addEventListener('input', debounce(async function () {
    deleteOldList();
    if (!inputLine.value) return;
    const arrOfRepositories = await search(inputLine.value);
    if (!arrOfRepositories) return;
    appendNewList(arrOfRepositories);
}, 400));

async function search(searchLine) {
    let response;

        try {
            response = await fetch(`https://api.github.com/search/repositories?q=${searchLine}&per_page=5`);
        } catch (err) {
            console.log(err);
            return null;
        }

        if (response.status !== 200) return null;

        let result;
        try {
            result = await response.json();
        } catch (err) {
            console.log(err);
            return null;
        }

        return result.items;
}

function  appendNewList(arrOfRepositories) {
    if (arrOfRepositories.length === 0) return;
    const ul = document.createElement('ul');
    ul.classList.add('search-line__list');

    arrOfRepositories.forEach(current => {
        ul.append(createListItem(current));
    });

    searchBlock.append(ul);
}

function createListItem(currentItem) {
    const li = document.createElement('li');
    li.classList.add('search-line__list-item');
    li.append(currentItem.name);
    li.addEventListener('click', function () {
       createReposBlock(currentItem);
    });
    return li;
}

function createReposBlock(currentItem) {
    const newBlock = document.createElement('div');
    newBlock.classList.add('repository');
    newBlock.innerHTML = `
        <p class="repository__text">Name: ${currentItem.name}</p>
        <p class="repository__text">Owner: ${currentItem.owner.login}</p>
        <p class="repository__text">Stars: ${currentItem.stargazers_count}</p>`;

    newBlock.append(createButton(newBlock));
    mainBlock.append(newBlock);

    deleteOldList();
    inputLine.value = '';
}

function  createButton(block) {
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('repository__button');
    button.innerHTML = '<img src="img/delete.svg" alt="delete block">';
    button.addEventListener('click', () =>
        block.remove()
    );
    return button;
}

function deleteOldList() {
    const list = document.querySelector('.search-line__list');
    if (list) list.remove();
}

function debounce(fn, debounceTime) {
    let lastTimeout;

    function funcWrapper(...args) {
        clearTimeout(lastTimeout);
        lastTimeout = setTimeout(() => {
            fn.apply(this, args);
        }, debounceTime);
    };

    return funcWrapper;
}
