
function clicked(){
    //alert("Get trolled")
    document.getElementById("application").innerHTML = "Invite only silly";
    setTimeout(function(){
        document.getElementById("application").innerHTML = "Apply Here";
    }, 1500);
}

const patchNotes = [
    {
        title: "Two IPs, One Fish",
        date: "06/02/2025",
        content: `
            <p>New Features:</p>
            <ul>
                <li>None</li>
                
            </ul>
            <p>Changes:</p>
            <ul>
                <li>Addition of an alternative IP (both are valid)</li>
                <li>* lax-041-01.wepwawet.net:25507</li>
                <li>* play.fishcultcraft.com</li>
            </ul>
        `
    },
    {
        title: "Wool Unraveled",
        date: "06/01/2025",
        content: `
            <p>New Features:</p>
            <ul>
                <li>Any color of wool and carpets are now craftable into string</li>
                <li><a href="https://modrinth.com/mod/exlines-wool-to-string">*Modrinth link</a></li>
            </ul>
            <p>Changes:</p>
            <ul>
                <li>None</li>
            </ul>
        `
    },
    {
        title: "Donkey Enters the Jungle",
        date: "04/19/2025",
        content: `
            <p>New Features:</p>
            <ul>
                <li>None</li>
            </ul>
            <p>Changes:</p>
            <ul>
                <li>Added _DonkeyKong as moderator</li>
                <li>* Serves as extra moderation alongside admins.</li>
            </ul>
        `
    },
    {
        title: "AFK In Style, Minecarts in Check",
        date: "04/19/2025",
        content: `
            <p>New Features:</p>
            <ul>
                <li>Added Styled Player List</li>
                <li>*The tab menu is now fully customizable.</li>
                <li>*FCC 10 logo, server TPS, and your ping is now viewable when pressing tab.</li>
                <li>Added AFKPlus</li>
                <li>*Type /afk -reason- in chat to set yourself as AFK.</li>
                <li>*Updates how AFK players are displayed in the tab menu.</li>
            </ul>
            <p>Changes:</p>
            <ul>
                <li>Removed minecart experiments</li>
                <li>*Minecarts no longer build up immense speeds.</li>
                <li>*Fixes all 1.21.5 farms that use minecarts.</li>
            </ul>
        `
    }
    // Add your patch notes here {title, date, content}
];

function displayPatchNotes() {
    const list = document.getElementById('patch-notes-list');
    patchNotes.forEach((note, index) => {
        const noteElement = document.createElement('div');
        noteElement.className = 'patch-note';
        noteElement.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.date}</p>
        `;
        noteElement.addEventListener('click', () => showModal(note));
        list.appendChild(noteElement);
        
    });
}

function showModal(note) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    modalTitle.textContent = note.title;
    modalContent.innerHTML = note.content;
    modal.style.display = 'block';
}

window.onload = function() {
    displayPatchNotes();
    document.getElementById('close-modal').addEventListener('click', () => {
        document.getElementById('modal').style.display = 'none';
    });
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
};

function toggleMenu() {
    const menu = document.querySelector('.menu-items');
    menu.classList.toggle('active');
}