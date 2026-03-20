"use client";

import { ContactInterface } from '@/interfaces/contactInterface';
import { DeleteContact, GetContacts } from '@/lib/Fetch';
import { GrabToken } from '@/lib/User-Fetches';
import { Navbar, TextInput, Button, Card, Label, Modal, ModalBody, ModalHeader } from 'flowbite-react';
import { Search, User, Mail, Phone, Plus, Edit, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

const ContactManager = () => {
  const [contacts, setContacts] = useState<ContactInterface[]>([])
  const [edit, setEdit] = useState(false);
  const [openModal, setOpenModal] = useState(false);

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
    setOpenModal(true)
    setEdit(true);

    setEmail(contact.email);
    setName(contact.name);
    setPhoneNumber(contact.phoneNumber);

  }

  useEffect(() => {
    const fetchContacts = async () => {
      const data: ContactInterface[] = await GetContacts(GrabToken());
      console.log(data);

      setContacts(data);
    };
    fetchContacts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <ModalHeader className='text-black text-center'>Edit Contact</ModalHeader>
        <ModalBody>
          <form className="flex flex-col gap-4">
            <div>
              <Label htmlFor="name" className="font-semibold" />
              <TextInput
                icon={User}
                placeholder="John Doe"
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
                onChange={handleContactPhoneNumber}
                required
                className='[&_input]:bg-white [&_input]:text-black'
              />
            </div>
            <Button onClick={(e) => { setOpenModal(false) }} className="bg-indigo-600 hover:bg-indigo-700 mt-2">
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
            className="w-full [&_input]:bg-white [&_input]:text-black"
            required
          />
        </div>
      </Navbar>
      <main className="max-w-8xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <Card className='dark:bg-white border-none'>
            <h2 className="text-xl text-black font-bold">Add New Contact</h2>
            <p className="text-sm text-gray-500 mb-3">Fill in the details below to add a new contact to your list.</p>
            <form className="flex flex-col gap-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" className="font-semibold" />
                </div>
                <TextInput //Input for Name
                  id="name"
                  type="text"
                  icon={User}
                  placeholder="John Doe"
                  required
                  className='[&_input]:bg-white [&_input]:text-black'
                />
              </div>
              <div className=''>
                <div className="mb-2 block">
                  <Label htmlFor="email" className="font-semibold" />
                </div>
                <TextInput //Input for Email
                  id="email"
                  type="email"
                  icon={Mail}
                  placeholder="john.doe@example.com"
                  className='[&_input]:bg-white [&_input]:text-black'
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="phone" className="font-semibold" />
                </div>
                <TextInput //Input for Phone Number
                  id="phone"
                  type="text"
                  icon={Phone}
                  placeholder="+1 (555) 123-4567"
                  className='[&_input]:bg-white [&_input]:text-black'
                  required
                />
              </div>
              <Button className="bg-indigo-600 hover:bg-indigo-700 mt-2">
                <Plus className="mr-2 h-4 w-4" /> Add Contact
              </Button>
            </form>
          </Card>
        </div>
        <div className="lg:col-span-8">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
              <h2 className="text-lg text-black font-bold ms-5">All Contacts</h2>
              <span className="text-sm text-gray-500"># contacts</span>
            </div>
            <div className="w-full">
              <div className='grid grid-cols-4 grid-rows-1 mb-5'>
                <p className="ms-3 dark:text-black bg-gray-50 uppercase text-xs">Name</p>
                <p className="bg-gray-50 dark:text-black uppercase text-xs">Email</p>
                <p className="ms-5 dark:text-black bg-gray-50 uppercase text-xs">Phone</p>
                <p className="ms-10 dark:text-black bg-gray-50 uppercase text-xs">Actions</p>
              </div>
              <div className="space-y-3">
                {contacts.map((item, idx) => (
                  <div key={idx} className='grid grid-cols-4'>
                    <div className="ms-3 whitespace-nowrap font-medium text-black">{item.name}</div>
                    <div className='dark:text-black'>{item.email}</div>
                    <div className='ms-5 text-black'>{item.phoneNumber}</div>
                    <div className='ms-10'>
                      <div className="flex gap-3">
                        <button onClick={() => { handleEdit(item), setOpenModal(true) }} className="text-indigo-600 hover:text-indigo-900">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => { handleDelete(item) }} className="text-red-500 hover:text-red-700 bg-red-100 p-1 rounded">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))};
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ContactManager