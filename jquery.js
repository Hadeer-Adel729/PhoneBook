$(document).ready(function() {
    const contactManager = new ContactManager();

    if (localStorage.getItem('contacts')) {
        const savedContacts = JSON.parse(localStorage.getItem('contacts'));
        savedContacts.forEach(contact => {
            contactManager.addContact(new Contact(contact.name, contact.phone, contact.email, contact.gender));
        });
        contactManager.updateContactList();
    }

    $('#add-contact-form').on('submit', function(event) {
        event.preventDefault();
        const name = $('#name').val();
        const phone = $('#phone').val();
        const email = $('#email').val();
        const gender = $('#gender').val();

        const newContact = new Contact(name, phone, email, gender);
        contactManager.addContact(newContact);
        contactManager.updateContactList();

        localStorage.setItem('contacts', JSON.stringify(contactManager.contacts));

        $('#add-contact-form')[0].reset();

        $.mobile.changePage('#home');
    });

    $('#search-contact').on('input', function() {
        const filter = $(this).val();
        contactManager.updateContactList(filter);
    });

    $(document).on('click', '#contact-list li a', function() {
        const index = $(this).data('index');
        contactManager.showContact(index);
        $('#delete-contact').data('index', index); // Store the index for deletion
    });

    $('#delete-contact').on('click', function() {
        const index = $(this).data('index');
        contactManager.deleteContact(index);
        contactManager.updateContactList();

        localStorage.setItem('contacts', JSON.stringify(contactManager.contacts));

        $.mobile.changePage('#home');
    });
});

class Contact {
    #name;
    #phone;
    #email;
    #gender;
    constructor(name, phone, email, gender) {
        this.#name = name;
        this.#phone = phone;
        this.#email = email;
        this.#gender = gender;
    }
    get name() {
        return this.#name;
    }
    get phone() {
        return this.#phone;
    }
    get email() {
        return this.#email;
    }
    get gender() {
        return this.#gender;
    }
}

class ContactManager {
    #contacts;
    constructor() {
        this.#contacts = [];
    }
    addContact(contact) {
        this.#contacts.push(contact);
    }
    get contacts() {
        return this.#contacts;
    }
    searchContact(name) {
        return this.#contacts.filter(contact => contact.name.toLowerCase().includes(name.toLowerCase()));
    }
    updateContactList(filter = '') {
        $('#contact-list').empty();
        let filteredContacts = this.searchContact(filter);
        filteredContacts.forEach((contact, index) => {
            $('#contact-list').append(`<li><a href="#contact-details" data-index="${index}">${contact.name}</a></li>`);
        });
        $('#contact-list').listview('refresh');
    }
    showContact(index) {
        let contact = this.#contacts[index];
        $('#contact-info').html(`
            <p><strong>Name:</strong> ${contact.name}</p>
            <p><strong>Phone:</strong> ${contact.phone}</p>
            <p><strong>Email:</strong> ${contact.email}</p>
            <p><strong>Gender:</strong> ${contact.gender}</p>
        `);
    }
    deleteContact(index) {
        this.#contacts.splice(index, 1);
    }
}