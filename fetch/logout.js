let logoutButton = document.querySelector('#logoutButton');

logoutButton.addEventListener('click', e => {

    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    localStorage.removeItem('password')

    window.location.replace(`index.html`)
})


if (localStorage.getItem('admin') == 'true') {
    if (document.querySelector('#uploadButtonInHeader')) {
        let uploadButtonInHeader = document.querySelector('#uploadButtonInHeader');
        uploadButtonInHeader.innerHTML = `<li>
        <span class="caret-margin-top">
            <i class="fa fa-file-excel-o" aria-hidden="true"></i>
            <span class="h-g"><a href="uploadfile.html">Upload Report</a></span>
        </span>
        </li>
        `;

        let clientPage = document.querySelector('#clientPage');
        clientPage.innerHTML = `<li>
        <span class="caret-margin-top">
            <i class="fa fa-user-o" aria-hidden="true"></i>
            <span class="h-g"><a href="client.html">Clinets</a></span>
        </span>
        </li>
        `;
        let createEmployeebutton = document.querySelector('#createEmployeebutton');
        createEmployeebutton.innerHTML = `<a class="dropdown-item" href="client.html"><i class="fa fa-lock m-r-5 text-muted"></i>Clients</a>`;

    }
}
