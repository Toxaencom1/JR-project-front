let pageSize = 3;
let totalAccounts = 0;
let currentPage = 0;

$(document).ready(function () {
    totalAccounts = getTotalServerAccounts();
    reDraw()
});


function getPlayers(pageSize, pageNumber) {
    $.get('/rest/players?pageSize=' + pageSize + '&pageNumber=' + pageNumber, function (data) {
        $('#table tbody').empty();
        $.each(data, function (index, player) {
            const birthday = new Date(player.birthday).toLocaleDateString();
            const row = `
                        <tr>
                            <td>${player.id}</td>
                            <td id="name-${player.id}">${player.name}</td>
                            <td id="title-${player.id}">${player.title}</td>
                            <td id="race-${player.id}">${player.race}</td>
                            <td id="profession-${player.id}">${player.profession}</td>
                            <td>${player.level}</td>
                            <td>${birthday}</td>
                            <td id="banned-${player.id}">${player.banned}</td>'+'
                            <td><button id="edit${player.id}" class="edit" onclick='editOrSave(${player.id})'></button></td>
                            <td><button id="delete${player.id}" class="delete" onclick='deleteAccount(${player.id})'></button></td>
                        </tr>
                    `;

            $('#table tbody').append(row);
        });
    }).fail(function () {
        console.error('Error fetching data.');
    });
    createPaginationButtons(pageSize, pageNumber);
}

function createPaginationButtons(pageSize, pageNumber) {
    let getTotal = getTotalServerAccounts();
    const totalPages = Math.ceil(getTotal / pageSize);
    const $pagination = $('#pagination');
    $pagination.empty();

    for (let i = 0; i < totalPages; i++) {
        const button = $('<button>')
            .text(i + 1)
            .attr('data-page', i)
            .click(function () {
                currentPage = i;
                reDraw();
            });

        if (i === pageNumber) {
            button.addClass('activePage');
        }
        $pagination.append(button);
    }
}

function getTotalServerAccounts() {
    let res = 0;
    let url = "/rest/players/count";
    $.ajax({
        url: url,
        async: false,
        success: function (result) {
            res = parseInt(result, 10);
        }
    })
    console.log(res);
    return res;
}

function getTotalPages(pageSize) {
    const totalAccounts = getTotalServerAccounts();
    return Math.ceil(totalAccounts / pageSize);
}

function reDraw() {
    getPlayers(pageSize, currentPage);
    createPaginationButtons(pageSize, currentPage);
}

function initializeSelectHandler() {
    const selectElement = document.getElementById('selection');
    selectElement.addEventListener('change', function () {
        pageSize = parseInt(selectElement.value, 10);
        if (currentPage > getTotalPages(pageSize))
            currentPage = 0;
        reDraw();
    });
}

function deleteAccount(playerId) {
    const userConfirmed = confirm("Are you sure you want to delete this Account?");
    if (userConfirmed) {
        $.ajax({
            url: `/rest/players/${playerId}`,
            type: 'DELETE',
            success: function () {
                reDraw()
            }
        });
    }
}

function editOrSave(id) {
    let $edit = $('#edit' + id);
    let $name = $("#name-" + id);
    let $title = $("#title-" + id);
    let $race = $("#race-" + id);
    let $profession = $("#profession-" + id);
    let $banned = $("#banned-" + id);

    const button = document.getElementById('delete' + id);
    if ($edit.hasClass("editMode")) {
        saveFromEdit(id);
        $edit.removeClass();
        $edit.addClass('edit');
        $(button).show();
    } else {
        $(button).hide();
        $edit.removeClass();
        $edit.addClass('editMode');

        $name.html('<input type="text" id="nameEdit-' + id + '" value="' + $name.text() + '" maxlength="12">');
        $title.html('<input type="text" id="titleEdit-' + id + '" value="' + $title.text() + '" maxlength="30">');

        let raceOptions = '<select id="raceEdit-' + id + '">' +
            '<option value="HUMAN">HUMAN</option>' +
            '<option value="DWARF">DWARF</option>' +
            '<option value="ELF">ELF</option>' +
            '<option value="GIANT">GIANT</option>' +
            '<option value="ORC">ORC</option>' +
            '<option value="TROLL">TROLL</option>' +
            '<option value="HOBBIT">HOBBIT</option>' +
            '</select>';
        let raceText = $race.text();
        $race.html(raceOptions);
        $('#raceEdit-' + id).val(raceText);

        let professionOptions = '<select id="professionEdit-' + id + '">' +
            '<option value="WARRIOR">WARRIOR</option>' +
            '<option value="ROGUE">ROGUE</option>' +
            '<option value="SORCERER">SORCERER</option>' +
            '<option value="CLERIC">CLERIC</option>' +
            '<option value="PALADIN">PALADIN</option>' +
            '<option value="NAZGUL">NAZGUL</option>' +
            '<option value="WARLOCK">WARLOCK</option>' +
            '<option value="DRUID">DRUID</option>' +
            '</select>';
        let professionText = $profession.text();
        $profession.html(professionOptions);
        $('#professionEdit-' + id).val(professionText);

        let bannedSelector = '<select id="bannedEdit-' + id + '">' +
            '<option value="true">true</option>' +
            '<option value="false">false</option>' +
            '</select>';
        let bannedText = $banned.text();
        $banned.html(bannedSelector);
        $('#bannedEdit-' + id).val(bannedText);
    }
}

function saveFromEdit(id) {
    const userConfirmed = confirm("Confirm edit data?");
    if (userConfirmed) {
        let updatedPlayer = {
            id: id,
            name: $('#nameEdit-' + id).val(),
            title: $('#titleEdit-' + id).val(),
            race: $('#raceEdit-' + id).val(),
            profession: $('#professionEdit-' + id).val(),
            banned: $('#bannedEdit-' + id).val()
        };
        // alert(JSON.stringify(updatedPlayer, null, 2));
        $.ajax({
            url: `/rest/players/${id}`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(updatedPlayer),
            success: function () {
                reDraw();
            },
            error: function () {
                alert("ERROR");
                console.error('Error saving data.');
                reDraw();
            }
        });
    }
}

function createNewAccount(){
    const userConfirmed = confirm("Is the data correct?");
    if (userConfirmed) {
        let $name = $('#inputName');
        let $title = $('#inputTitle');
        let $race = $('#inputRace');
        let $profession = $('#inputProfession');
        let $level = $('#inputLevel');
        let $birthday = $('#inputBirthday');
        let $banned = $('#inputBanned');

        const milliseconds = new Date($birthday.val()).getTime();
        let banned = ($banned.val() === 'true');

        let playerInfo = {
            name: $name.val(),
            title: $title.val(),
            race: $race.val(),
            profession: $profession.val(),
            birthday: milliseconds,
            banned: banned,
            level: parseInt($level.val())
        };
        // alert(JSON.stringify(playerInfo, null, 2));

        $.ajax({
            url: `/rest/players`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(playerInfo),
            success: function () {
                alert("Congratulations! Account created.");
                clearInputFields();
                reDraw();
            },
            error: function () {
                alert("ERROR");
                console.error('Error saving data.');
                reDraw();
            }
        });
    }
}

function clearInputFields() {
    $('#inputName').val('');
    $('#inputTitle').val('');
    $('#inputRace').val('HUMAN'); // Сбрасываем к первому значению по умолчанию
    $('#inputProfession').val('WARRIOR'); // Сбрасываем к первому значению по умолчанию
    $('#inputLevel').val('');
    $('#inputBirthday').val('');
    $('#inputBanned').val('FALSE'); // Сбрасываем к значению по умолчанию
}

window.addEventListener('DOMContentLoaded', () => {
    initializeSelectHandler();
});