"use client";

import { ContactInterface } from '@/interfaces/contactInterface';
import { UserData } from '@/interfaces/userInterface';
import { DeleteContact, GetContacts, AddContact, GetContactsByEmail, GetContactsByName, GetContactsByPhoneNumber, GetContactsByUserId, EditContact } from '@/lib/Fetch';
import { GrabToken, IsTokenValid, LoggedInUser } from '@/lib/User-Fetches';
import { Navbar, TextInput, Button, Card, Label, Modal, ModalHeader, ModalBody } from 'flowbite-react';
import { Search, User, Mail, Phone, Plus, Edit, Trash2, Users, Grab, UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ContactManager = () => {
  const [contacts, setContacts] = useState<ContactInterface[]>([]);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhoneNumber, setEditPhoneNumber] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [searchEntry, setSearchEntry] = useState("");
  const [searchedForContact, setSearchedForContact] = useState<ContactInterface | null>(null);

  const { push } = useRouter();

  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [contactUserId, setContactUserId] = useState(0);
  const [contactId, setContactId] = useState(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleContactName = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
  const handleContactEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handleContactPhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value);

  const handleDelete = async (contact: ContactInterface) => {
    const result = await DeleteContact(contact, GrabToken());
    return result;
  };

  const handleEdit = (contact: ContactInterface) => {
    setOpenModal(true);
    setContactId(contact.id);
    setEditEmail(contact.email);
    setEditName(contact.name);
    setEditPhoneNumber(contact.phoneNumber);
  }

  const handleSaveEdit = async () => {
    const updatedContact: ContactInterface = {
      id: contactId,
      userId: contactUserId,
      name: editName,
      email: editEmail,
      phoneNumber: editPhoneNumber
    };

    const result = await EditContact(updatedContact, GrabToken());

    if (result) {
      setContacts((prev) =>
        prev.map((contact) => (contact.id === contactId ? updatedContact : contact)))
    };
    setOpenModal(false);
  }

  const handleSearchResult = async () => {
    const search = searchEntry.toLowerCase();

    const found = contacts.find((contact) =>
      contact.name.toLowerCase().includes(search) ||
      contact.email.toLowerCase().includes(search) ||
      contact.phoneNumber.toLowerCase().includes(search)
    );

    if (found) {
      setSearchedForContact(found);
    } else {
      setSearchedForContact(null);
    }

    setOpenSearchModal(true);
  }

  const handleAddingContact = async () => {
    const newContact: ContactInterface = {
      id: 0,
      userId: 0,
      name,
      email,
      phoneNumber
    };

    const created = await AddContact(newContact, GrabToken());

    if (created) {
      setContacts((prev) => [...prev, created]);
      setName("");
      setEmail("");
      setPhoneNumber("");
    }
  };

  useEffect(() => {
    const GetUserLogin = async () => {
      const userLoggedIn: UserData = LoggedInUser();

      const data = await GetContacts(GrabToken());
      console.log("Raw API response:", data)
      console.log("Token used:", GrabToken())
      setContacts(data);
    };

    if (!IsTokenValid()) {
      push("/");
    }
    else { GetUserLogin() };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Modal dismissible show={openSearchModal} onClose={() => setOpenSearchModal(false)}>
        <ModalHeader>Search Result</ModalHeader>
        <ModalBody>
          {searchedForContact ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <UserIcon className="dark:text-white w-7 h-7 text-white" />
                <span className="text-white text-2xl">{searchedForContact.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-7 h-7 text-white" />
                <span className="text-white text-2xl">{searchedForContact.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-7 h-7 text-white" />
                <span className="text-white text-2xl">{searchedForContact.phoneNumber}</span>
              </div>
            </div>
          ) : (
            <p className="text-white text-2xl">No contact found for &quot;{searchEntry}&quot;.</p>
          )}
        </ModalBody>
      </Modal>
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <ModalHeader className='text-black text-center'>Edit Contact</ModalHeader>
        <ModalBody>
          <form className="flex flex-col gap-4">
            <div>
              <Label htmlFor="name" className="font-semibold" />
              <TextInput
                icon={User}
                placeholder="John Doe"
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
                required
                className='[&_input]:bg-white [&_input]:text-black'
              />
            </div>
            <div>
              <Label htmlFor="email" className="font-semibold" />
              <TextInput
                icon={Mail}
                placeholder="john.doe@example.com"
                value={editEmail}
                onChange={(event) => setEditEmail(event.target.value)}
                required
                className='[&_input]:bg-white [&_input]:text-black'
              />
            </div>
            <div>
              <Label htmlFor="phone" className="font-semibold" />
              <TextInput
                icon={Phone}
                placeholder="+1 (555) 123-4567"
                value={editPhoneNumber}
                onChange={(event) => setEditPhoneNumber(event.target.value)}
                required
                className='[&_input]:bg-white [&_input]:text-black'
              />
            </div>
            <Button onClick={handleSaveEdit} className="bg-indigo-600 hover:bg-indigo-700 mt-2">
              <Plus className="mr-2 h-4 w-4" /> Save Edits
            </Button>
          </form>
        </ModalBody>
      </Modal>
      <Navbar fluid className="dark:bg-white border-b border-gray-200 py-4">
        <Navbar className='dark:bg-white'>
          <div className="flex dark:bg-white items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Users className="text-white w-5 h-5" />
            </div>
            <span className="self-center whitespace-nowrap text-3xl font-bold dark:text-black">
              <span className="text-indigo-600 me-2 text-3xl">ContactFlow</span> Contact Manager
            </span>
          </div>
        </Navbar>
        <div className="bg-white flex md:order-2 w-full max-w-sm">
          <TextInput
            id="searchBar"
            type="text"
            icon={Search}
            placeholder="Search contacts..."
            value={searchEntry}
            onChange={(event) => setSearchEntry(event.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") handleSearchResult() }}
            className="w-full [&_input]:bg-white [&_input]:text-black"
          />
        </div>
      </Navbar>
      <main className="max-w-8xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <Card className='dark:bg-white border-none'>
            <h2 className="text-xl text-black font-bold">Add New Contact</h2>
            <p className="text-sm text-gray-500 mb-3">
              Fill in the details below to add a new contact to your list.
            </p>
            <form className="flex flex-col gap-4">
              <div>
                <Label htmlFor="name" className="font-semibold" />
                <TextInput
                  icon={User}
                  placeholder="John Doe"
                  value={name}
                  onChange={handleContactName}
                  required
                  className='[&_input]:bg-white [&_input]:text-black'
                />
              </div>
              <div>
                <Label htmlFor="email" className="font-semibold" />
                <TextInput
                  icon={Mail}
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={handleContactEmail}
                  required
                  className='[&_input]:bg-white [&_input]:text-black'
                />
              </div>
              <div>
                <Label htmlFor="phone" className="font-semibold" />
                <TextInput
                  icon={Phone}
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={handleContactPhoneNumber}
                  required
                  className='[&_input]:bg-white [&_input]:text-black'
                />
              </div>
              <Button onClick={(e) => handleAddingContact()} className="bg-indigo-600 hover:bg-indigo-700 mt-2">
                <Plus className="mr-2 h-4 w-4" /> Add Contact
              </Button>
            </form>
          </Card>
        </div>
        <div className="lg:col-span-8">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">

            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
              <h2 className="text-lg text-black font-bold ms-5">All Contacts</h2>
              <span className="text-sm text-gray-500">
                {contacts.length} contacts
              </span>
            </div>
            <div className="w-full">
              <div className='grid grid-cols-4 mb-5'>
                <p className="ms-3 text-black bg-gray-50 uppercase text-xs">Name</p>
                <p className="text-black bg-gray-50 uppercase text-xs">Email</p>
                <p className="ms-5 text-black bg-gray-50 uppercase text-xs">Phone</p>
                <p className="ms-10 text-black bg-gray-50 uppercase text-xs">Actions</p>
              </div>
              <div className="space-y-3">
                {contacts.map((item, idx) => (
                  <div key={idx} className='grid grid-cols-4'>
                    <div className="ms-3 whitespace-nowrap font-medium text-black">{item.name}</div>
                    <div className='text-black'>{item.email}</div>
                    <div className='ms-5 text-black'>{item.phoneNumber}</div>

                    <div className='ms-10'>
                      <div className="flex gap-3">
                        <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-900">
                          <Edit className="w-5 h-5" />
                        </button>

                        <button onClick={() => handleDelete(item)} className="text-red-500 hover:text-red-700 bg-red-100 p-1 rounded">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactManager;