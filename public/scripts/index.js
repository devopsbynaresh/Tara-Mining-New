// Activate carousel on equipment show page
$(function () {
    $('.carousel-inner').find('.carousel-item:first').addClass("active");
})

function ValidateImageFileSize(file) {
    let maxFileSize = 1; // in MB
    let fileSize = file.files[0].size / 1024 / 1024; // convert to MB
    let fileName = file.files[0].name;
    if (fileSize > maxFileSize) {
        $(file).val(''); //for clearing with Jquery
        $(".custom-file-label").html("");
        alert('File size exceeds ' + maxFileSize + ' MB');
    } else {
        $(".custom-file-label").html(fileName);
    }
}

function ValidateDatasheetFileSize(file) {
    let maxFileSize = 3; // in MB
    let fileSize = file.files[0].size / 1024 / 1024; // convert to MB
    let fileName = file.files[0].name;
    if (fileSize > maxFileSize) {
        $(file).val(''); //for clearing with Jquery
        $(".custom-file-label").html("");
        alert('File size exceeds ' + maxFileSize + ' MB');
    } else {
        $(".custom-file-label").html(fileName);
    }
}

// function is called when any equipment-index-card-image is clicked
function createComparisonSet(element) {
    let comparisonArray = []; // holds the ids of equipment to compare
    let compareSetIds = new Set();
    let comparisonArrayNames = []; // holds the names of equipment to compare
    let compareSetNames = new Set();
    let idKey = 'compareSetId';
    let nameKey = 'compareSetName';
    let maxCompare = 2;

    if (sessionStorage.getItem(idKey)) {
        comparisonArray = JSON.parse(sessionStorage.getItem(idKey));
        comparisonArray.forEach(id => {
            compareSetIds.add(id);
        })
    }

    if (sessionStorage.getItem(nameKey)) {
        comparisonArrayNames = JSON.parse(sessionStorage.getItem(nameKey));
        comparisonArrayNames.forEach(name => {
            compareSetNames.add(name);
        })
    }

    let value = $(element).parent().parent().find(".store-equipmentId").text(); // read from hidden element
    let name = $(element).parent().parent().find(".store-equipmentName").text(); // read from hidden element
    if (compareSetIds.has(value)) {
        compareSetIds.delete(value);
        compareSetNames.delete(name);
        $(element).parent().parent().removeClass('comparison-selected');
    } else {
        if (compareSetIds.size < maxCompare) {
            compareSetIds.add(value);
            compareSetNames.add(name);
            $(element).parent().parent().addClass('comparison-selected');
        }
    }
    comparisonArray = [...compareSetIds];
    comparisonArrayNames = [...compareSetNames];

    $('#compareSetStore').val(comparisonArray.join());
    $('#compareSetDisplay').val(comparisonArrayNames.join(' & '));

    sessionStorage.setItem(idKey, JSON.stringify(comparisonArray));
    sessionStorage.setItem(nameKey, JSON.stringify(comparisonArrayNames));

}

$(function () {
    let idKey = 'compareSetId';
    let nameKey = 'compareSetName';
    let arrayOfIds = [];

    if (sessionStorage.getItem(idKey)) {
        $(".store-equipmentId").each(function () {
            arrayOfIds = JSON.parse(sessionStorage.getItem(idKey));
            let storeEquipmentIdText = this.innerHTML;
            if (arrayOfIds.includes(storeEquipmentIdText)) {
                $(this).parent().parent().addClass('comparison-selected');
            }
        });
        comparisonArray = JSON.parse(sessionStorage.getItem(idKey));
        $('#compareSetStore').val(comparisonArray.join());
        comparisonArrayNames = JSON.parse(sessionStorage.getItem(nameKey));
        $('#compareSetDisplay').val(comparisonArrayNames.join(' & '));
    }
})

function clearSelected() {
    let idKey = 'compareSetId';
    let nameKey = 'compareSetName';

    if (sessionStorage.getItem(idKey)) {
        sessionStorage.removeItem(idKey);
    }

    if (sessionStorage.getItem(nameKey)) {
        sessionStorage.removeItem(nameKey);
    }

    $('.equipment-index-card').removeClass('comparison-selected');
    $('#compareSetDisplay').val('');
    $('#compareSetStore').val('');
}

// Remember search terms
function submitSearchTerms(element) {
    let searchTerms = $('#search-form-widget').val();
}

// On page load restore search terms from session memory
// $(function () {
//     if (sessionStorage.getItem('searchTerms')) {
//         $('#searchTerms').val(JSON.parse(sessionStorage.getItem('searchTerms')));
//     }
// })
function handleProduct (id){
    document.getElementById("c"+ id).checked = !document.getElementById("c"+ id).checked

}
function handleCompare(){
    let temp = document.getElementsByClassName("detect");
    let tempString = []
   for(let i = 0, len = temp.length | 0; i <len; i = i + 1 | 0){
       if(temp[i].checked){
          tempString.push(temp[i].id.substring(1))
       }
   }
   $('#id').val(tempString)
   $('#compareForm').submit()

}

function onChangeFilterChecks() {
    let mineralFilter = [];
    let miningMethodFilter = [];
    let miningTypeFilter = []
    let mineActivityFilter = []
    let miningCycleFilter = []

    // miningType
    if ($('#filter_mining_type_underground').prop("checked") == true) {
        miningTypeFilter.push('Underground')
    }
    if ($('#filter_mining_type_surface').prop("checked") == true) {
        miningTypeFilter.push('Surface')
    }
    if ($('#filter_mining_type_mineral_processing_and_beneficiation').prop("checked") == true) {
        miningTypeFilter.push('Mineral Processing and Beneficiation')
    }
    if (miningTypeFilter.length > 0) {
        $('#miningTypeFilter').val(miningTypeFilter.join(','))
    }

    // miningCycle
    if ($('#filter_mining_cycle_mine_development').prop("checked") == true) {
        miningCycleFilter.push('Mine Development')
    }
    if ($('#filter_mining_cycle_access_development').prop("checked") == true) {
        miningCycleFilter.push('Access Development')
    }
    if ($('#filter_mining_cycle_logistics').prop("checked") == true) {
        miningCycleFilter.push('Logistics')
    }
    if ($('#filter_mining_cycle_stopping').prop("checked") == true) {
        miningCycleFilter.push('Stopping')
    }
    if (miningCycleFilter.length > 0) {
        $('#miningCycleFilter').val(miningCycleFilter.join(','))
    }

    // mineActivity
    if ($('#filter_mining_activity_drilling').prop("checked") == true) {
        mineActivityFilter.push('Drilling')
    }
    if ($('#filter_mining_activity_blasting').prop("checked") == true) {
        mineActivityFilter.push('Blasting')
    }
    if ($('#filter_mining_activity_cleaning').prop("checked") == true) {
        mineActivityFilter.push('Cleaning')
    }
    if ($('#filter_mining_activity_supporting').prop("checked") == true) {
        mineActivityFilter.push('Supporting')
    }
    if (mineActivityFilter.length > 0) {
        $('#miningActivityFilter').val(mineActivityFilter.join(','))
    }

    // mining method
    if ($('#filter_mining_method_mechanised').prop("checked") == true) {
        miningMethodFilter.push('Mechanised')
    }
    if ($('#filter_mining_method_conventional').prop("checked") == true) {
        miningMethodFilter.push('Conventional')
    }
    if ($('#filter_mining_method_hybrid').prop("checked") == true) {
        miningMethodFilter.push('Hybrid')
    }
    if ($('#filter_mining_method_autonomous').prop("checked") == true) {
        miningMethodFilter.push('Autonomous')
    }
    if (miningMethodFilter.length > 0) {
        $('#miningMethodFilter').val(miningMethodFilter.join(','))
    }

    // mineral
    if ($('#filter_mineral_gold').prop("checked") == true) {
        mineralFilter.push('Gold')
    }
    if ($('#filter_mineral_platinum').prop("checked") == true) {
        mineralFilter.push('Platinum')
    }
    if ($('#filter_mineral_coal').prop("checked") == true) {
        mineralFilter.push('Coal')
    }
    if ($('#filter_mineral_diamonds').prop("checked") == true) {
        mineralFilter.push('Diamonds')
    }
    if ($('#filter_mineral_base_metals').prop("checked") == true) {
        mineralFilter.push('Base Metals')
    }
    if ($('#filter_mineral_other').prop("checked") == true) {
        mineralFilter.push('Other')
    }
    if (mineralFilter.length > 0) {
        $('#mineralFilter').val(mineralFilter.join(','))
    }

    // $('#filterForm').submit()
}
const handleApplyFilters = () =>{
    $('#filterForm').submit()

}
function OtherFunction(){
    // $('#search').val("XXXXXXXXXX");
    // $('newSearchForm').submit();

}
function handleSuggestionClick(val){
let word = document.getElementById("search-form-widget").value;

let commas = word.split(",");
if(commas.length > 1){
    let t = ""
    for(let i = 0; i < commas.length - 1; i = i + 1){
        t = t + commas[i] + ",";
    }
    t = t + val
    let temp = document.getElementById("searchNext")
    temp.value = t
    let tempTwo = document.getElementById("search-form-widget");
    tempTwo.value = t;
    tempTwo.focus()
}else{
    let temp = document.getElementById("searchNext")
    temp.value = val
    let tempTwo = document.getElementById("search-form-widget");
    tempTwo.value = val
    tempTwo.focus()
    
        //   let temp = document.getElementById("searchList"); 
        // document.removeEventListener("click", handleMouseDown)
        //   temp.parentNode.removeChild(temp);

}
    // document.getElementById("newSearchForm").submit()

}
const submitFinalSearch = () =>{
    document.getElementById("newSearchForm").submit()

}
const defineClickSensor = () =>{
    document.addEventListener("click", handleMouseDown)
}
const handleMouseDown = (evt) =>{
    let flyoutEl = document.getElementById('searchList'),
      targetEl = evt.target; // clicked element 
      if(targetEl == flyoutEl){
      } else{
          let temp = document.getElementById("searchList"); 
          temp.parentNode.removeChild(temp);
      }
}
function handleSearchChange(val){
    let word = val.value.split(",");
    let useWord = ""
    if(word.length > 1){
       useWord =  word[word.length - 1]
    }else{
        useWord = val.value
    }
    console.log("CHECK WORD", useWord);
    if(!useWord)return0

    $.get("/equipment/partial/search",{
        name: useWord
    }).then((data)=>{
    if(data.status === "Success"){
        let temp = document.querySelector("#searchWrapper");
        let ul = document.createElement("ul");
        ul.id = "searchList"
        ul.className = "suggestion-wrapper"
        for(let i = 0 ; i < 5; i = i + 1){
            let innerTemp = document.createElement('li');
            innerTemp.innerHTML = data.message[i]
            innerTemp.id = "iih" + data.message[i]
            innerTemp.onclick = ()=>{ handleSuggestionClick(data.message[i])}
            ul.appendChild(innerTemp);

        }
        defineClickSensor()
        temp.appendChild(ul);


    }

    }).catch(err =>{
        
console.error("Error", err);
    })
    // $('#nameSearch').val(val.value)
    // $('#searchForm').submit()

}
function submitSearch(){
    // let searchTerms = $('#search-form-widget').val();
    // $('#name').val(searchTerms)
    
    // $('#searchForm').submit()
    // console.log("search", searchTerms);

}
// Remeber filter selections
function submitFilterTerms(element) {
    arrayOfFilters = [];

    let miningCycle = $('#miningCycle option:selected').text();
    arrayOfFilters.push(miningCycle);
    let miningCycleIndex = $('#miningCycle').prop('selectedIndex');
    sessionStorage.setItem('miningCycle', miningCycleIndex);

    let mineActivity = $('#mineActivity option:selected').text();
    arrayOfFilters.push(mineActivity);
    let mineActivityIndex = $('#mineActivity').prop('selectedIndex');
    sessionStorage.setItem('mineActivity', mineActivityIndex);

    let miningMethod = $('#miningMethod option:selected').text();
    arrayOfFilters.push(miningMethod);
    let miningMethodIndex = $('#miningMethod').prop('selectedIndex');
    sessionStorage.setItem('miningMethod', miningMethodIndex);

    let mineral = $('#mineral option:selected').text();
    arrayOfFilters.push(mineral);
    let mineralIndex = $('#mineral').prop('selectedIndex');
    sessionStorage.setItem('mineral', mineralIndex);

    $('#filterParams').val(arrayOfFilters.join());

}

function submitGraphicalFilterTerms(element) {
    let miningOperationsTerms = ['miningCycle', 'mineActivity', 'miningMethod', 'mineral'];
    let miningCycles = ['Mine Development', 'Access Development', 'Stoping', 'Logistics'];
    let mineActivities = ['Drilling', 'Blasting', 'Cleaning', 'Supporting', 'Services'];

    if (sessionStorage.getItem(miningOperationsTerms[0])) {
        sessionStorage.removeItem(miningOperationsTerms[0]);
    }

    if (sessionStorage.getItem(miningOperationsTerms[1])) {
        sessionStorage.removeItem(miningOperationsTerms[1]);
    }

    let filterTerms = $(element).closest('form').find('input').attr('value');

    let filterFieldsArray = filterTerms.split(',').map(item => item.trim());

    let miningCycleIndex = miningCycles.indexOf(filterFieldsArray[0]) + 1; // +1 because 'None' selection is index 0

    let mineActivityIndex = mineActivities.indexOf(filterFieldsArray[1]) + 1; // +1 because 'None' selection is index 0

    sessionStorage.setItem(miningOperationsTerms[0], miningCycleIndex);
    sessionStorage.setItem(miningOperationsTerms[1], mineActivityIndex);
}

// On page load, restore filters from session memory
$(function () {
    if (sessionStorage.getItem('miningCycle'))
        $('#miningCycle').prop('selectedIndex', JSON.parse(sessionStorage.getItem('miningCycle')));

    if (sessionStorage.getItem('mineActivity'))
        $('#mineActivity').prop('selectedIndex', JSON.parse(sessionStorage.getItem('mineActivity')));

    if (sessionStorage.getItem('miningMethod'))
        $('#miningMethod').prop('selectedIndex', JSON.parse(sessionStorage.getItem('miningMethod')));

    if (sessionStorage.getItem('mineral'))
        $('#mineral').prop('selectedIndex', JSON.parse(sessionStorage.getItem('mineral')));
})

$(function () {
    $('[data-toggle="popover"]').popover({
        html: true,
        trigger: 'hover',
        placement: 'bottom',
        container: 'body',
        content: function () { return '<img src="' + $(this).data('img') + '" />'; }
    });
})

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [month, day, year].join('/');
}

function goBack() {
    window.history.back();
}

//handle loader modal
const handleLoaderUser = (type) =>{
    if(type){
        document.getElementById("user-loading-modal-wrapper").style.display ="flex"

    }else{
        
    document.getElementById("user-loading-modal-wrapper").style.display ="none"
    }

}

//User page modal
let rejectId = ""
const openUsersModal = (id) =>{
    let temp = document.getElementById("custom-users-modal-wrapper")
    temp.style.display = "flex"
    rejectId = id
    console.log("IDDDDDDDDDDD",id.substring(1));

}
const closeModal = () =>{
    let temp = document.getElementById("custom-users-modal-wrapper")
    temp.style.display = "none"
    rejectId = "";

}
const openDeleteModal = () =>{
    let temp = document.getElementById("custom-user-delete-modal-wrapper")
    temp.style.display = "flex"
}
const closeDeleteModal = () =>{
    let temp = document.getElementById("custom-user-delete-modal-wrapper")
    temp.style.display = "none"

}
const handleReject = () =>{
    let text = $(`#user-reject-reason`).val();
    handleUserApproval(rejectId, "rejected", text);
    $(`#user-reject-reason`).val('')
    closeModal()
    rejectId = "";
}
const handleUserApproval =async (data, status, reason ="") =>{
    handleLoaderUser(true)
    let id = data;

 $.ajax({
     url: `/users/approve/user?id=${id}&status=${status}&reason=${reason}`,
     type: "PUT",
    success: (res) =>{
        // let 
        let tempEle = document.getElementById(`status${id}`) 
        console.log("CHANGED",tempEle);
        tempEle.innerHTML = status.toUpperCase()
        if(status === "approved"){
            document.getElementById(`app${id}`).className ="button_disabled"
            document.getElementById(`rej${id}`).className =""

        }else{
            document.getElementById(`app${id}`).className =""
            document.getElementById(`rej${id}`).className ="button_disabled"


        }
 
    handleLoaderUser(false)

    },
    error: (err) =>{
        console.error("ERROR ", err);
        handleLoaderUser(false)

    }
 })

}

const handleUserDelete = (id) =>{

    handleLoaderUser(true)
    $.ajax({
        url: `/users/${id}`,
        type:"DELETE",
        success : () =>{
            $(`#row${id}`).remove();
            handleLoaderUser(false)

        },
        error : () =>{
            handleLoaderUser(false)
            alert("Delete Unsuccessful")

        },

    })
}
const decideButtonDisability = (obj) =>{
    // console.log("DATA", obj);
    return false

}

//Equipment Table

const handleEquipmentApproval = async(id, status, reason ="") =>{
    handleLoaderUser(true)

 $.ajax({
     url: `/equipment/approve/equipment?id=${id}&status=${status}&reason=${reason}`,
     type: "PUT",
    success: (res) =>{
        // let 
        let tempEle = document.getElementById(`status${id}`) 
        console.log("CHANGED",tempEle);
        tempEle.innerHTML = status.toUpperCase()
        if(status === "approved"){
            document.getElementById(`app${id}`).className ="button_disabled"
            document.getElementById(`rej${id}`).className =""

        }else{
            document.getElementById(`app${id}`).className =""
            document.getElementById(`rej${id}`).className ="button_disabled"


        }
 
    handleLoaderUser(false)

    },
    error: (err) =>{
        console.error("ERROR ", err);
        handleLoaderUser(false)

    }
 })

}
let rejectIdEquip = ""
const openEquipModal = (id) =>{
    let temp = document.getElementById("custom-equip-modal-wrapper")
    temp.style.display = "flex"
    rejectIdEquip = id

}
const closeModalEquip = () =>{
    let temp = document.getElementById("custom-equip-modal-wrapper")
    temp.style.display = "none"
    rejectIdEquip = "";

}
const handleRejectEquip = () =>{
    let text = $(`#equip-reject-reason`).val();
    handleEquipmentApproval(rejectIdEquip, "rejected", text);
    $(`#equip-reject-reason`).val('')
    closeModalEquip()
    rejectIdEquip = "";
}
const handleEquipDelete = (id) =>{
    handleLoaderUser(true)
    $.ajax({
        url: `/equipment/${id}`,
        type:"DELETE",
        success : () =>{
            $(`#row${id}`).remove();
            handleLoaderUser(false)

        },
        error : () =>{
            handleLoaderUser(false)
            alert("Delete Unsuccessful")

        },

    })
}
//landing

const addClassToWrapper = (type) =>{
    if(type){
        document.getElementById("isotop-wrapper-id")?.classList.add("only-six")
    }else{
        document.getElementById("isotop-wrapper-id")?.classList.remove("only-six")

    }

}