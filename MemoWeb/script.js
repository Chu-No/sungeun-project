const addMemoform = document.getElementById('addMemoForm');
const newMemoInput = document.getElementById('newMemoInput');
const memoList = document.getElementById('memoList');

let memoArr = JSON.parse(localStorage.getItem('memoArr')) || [];
// 저장할 때, string형태로 저장됨.
//let: 변경은 가능 재선언 불가
//val : 변경 가능(모든 게 허용)
//const : 변경과 재선언 둘 다 안됨.

renderMemos();

addMemoform.addEventListener('submit', (e) => {
    e.preventDefault();

    addNewMemo();
    renderMemos();
    localStorage.setItem('memoArr', JSON.stringify(memoArr));
    // 여기에 있는 memoArr : []
})

function addNewMemo() {
    const newMemoValue = newMemoInput.value;
    
    const isEmptyNewMemo = newMemoValue === ''; //비어있는 지, 안비어있는 지 확인

    if (isEmptyNewMemo) {
        alert('메모를 입력해주세요.');
        return;
    }else{
        const memoObj = {
            id: memoArr.length ? memoArr[memoArr.length - 1].id + 1 : 0,
            title: newMemoValue
        }
    
        memoArr.push(memoObj);
    }
    newMemoInput.value = '';
    console.log(memoArr);
}

function renderMemos() {
    const memoListHtml = memoArr.map((memo) => {
        return `
        <div class="memoCard" id=${memo.id}>
            <div class="memoContent">
                <input class="memoTitle" value="${memo.title}" readonly="readonly" >
            </div>
            <div class="memoFooter">
                <button class="memoEditBtn" data-action="edit">수정</button>
                <button class="memoDeleteBtn" data-action="delete">삭제</button>
                <button class="memoEditDoneBtn" data-action="edit-done" style=display:none;>완료</button>
                <button class="memoEditCancelBtn" data-action="edit-cancel" style=display:none;>취소</button>
            </div>
        </div>
        `
    }).join('');
    memoList.innerHTML = memoListHtml;
    console.log(memoList);
}

memoList.addEventListener('click', (e) => {
    const target = e.target;
    const selectedParentElement = target.parentElement.parentElement;

    if (selectedParentElement.className === 'memoCard') {
        const selectedElementId = selectedParentElement.id;
        // const selectedMemoId = memoArr.findIndex(element => element.id == selectedElementId);
        const selectedMemoId = memoArr.findIndex(element => element.id === Number(selectedElementId));
        const selectedMemo = memoArr[selectedMemoId];

        const action = target.dataset.action;
        action === 'edit' && editMemo(selectedParentElement, selectedElementId);
        action === 'delete' && deleteMemo(selectedMemoId);

        console.log(selectedMemo, action);
    } else {
        return;
    }
    console.log(selectedParentElement)
})

function editMemo(selectedParentElement, selectedElementId) {
    console.log("editMemo--", selectedElementId)
    const aditMemoInput = selectedParentElement.querySelector('.memoTitle');
    const editBtn = selectedParentElement.querySelector('.memoEditBtn');
    const deleteBtn = selectedParentElement.querySelector('.memoDeleteBtn');
    const memoEditDoneBtn = selectedParentElement.querySelector('.memoEditDoneBtn');
    const memoEditCancelBtn = selectedParentElement.querySelector('.memoEditCancelBtn');

    aditMemoInput.removeAttribute('readonly'); //읽을 수만 있다는 거 (input 활성화)
    aditMemoInput.focus();

    editBtn.style.display = 'none'; // 처음부터 보이지 않게 하는 거
    deleteBtn.style.display = 'none'; // 처음부터 보이지 않게 (글이 없으니까)
    memoEditDoneBtn.style.display = 'inline-block'; //보이게 만들어줌.
    memoEditCancelBtn.style.display = 'inline-block'; //보이게 만들어줌.

    memoEditDoneBtn.addEventListener('click', (e) => { //클릭 이벤트가 발생하였을 때
        const editMemoInputValue = aditMemoInput.value;
        const isEmptyEditMemo = editMemoInputValue === '';

        if (isEmptyEditMemo) {
            alert('수정 내용을 입력하세요.')
            return;
        } else {
            const selectedMemoId = memoArr.findIndex(element => element.id === Number(selectedElementId));
            // = : 값 초기화   == : 값 동등화 === : 데이터 타입이 같다.(조건 딱 지정 (type 까지 다 같을 때))
            // findIndex : memoArr가 있으면, 그 객체 안에서 element id 값이 같을 때 인덱스 번호
            memoArr[selectedMemoId].title = editMemoInputValue;
            // [{id: 1, title: 가나}] -> 가나 
            // [{id: 1, title: 나가}] -> 나가 
            localStorage.setItem('memoArr', JSON.stringify(memoArr));
            // localStorage : 데이터 저장 공간 (새로 고침을 해도 남아있고, 껐다 켜도 남아있음.)
            // -> 자동 로그인 느낌 ( 브라우저 껐다 켜도 로그인 되는 그런 경우)
            // sessionStorage: 기능상 동일( 브라우저 끄면 없어짐.)
            
            renderMemos();
        }
    })

    memoEditCancelBtn.addEventListener('click', (e) => {
        renderMemos();
    })
}

function deleteMemo(selectedMemoId) {
    memoArr.splice(selectedMemoId, 1);
    renderMemos();
    localStorage.setItem('memoArr', JSON.stringify(memoArr));
}
//map : 값들에 접근해 빼내 쓸 수 있음. python list느낌
//event listener : html 소스에 버튼이나 여러가지, inputbox가있을텐데 그기서
//어떤 이벤트가 일어나는 지 감지(클릭, 엔터 ``` 등)

//stringpy : json 읽기 좋게 만든 거를 다시 json 형태로 바꾸는 거
//json :  원래는 data형식 (csv)를 많이 쓰는데, 데이터의 표현형식