import { useState, useEffect, Fragment } from 'react';
import { signIn, signOut, useSession, getSession } from 'next-auth/react';
import { Menu, Transition } from '@headlessui/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Home() {
  const { data: session, status: sessionStatus } = useSession();
  const [videoId, setVideoId] = useState('');
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      signIn();
    }
  }, [sessionStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/change-title', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        videoId,
        newTitle,
      }),
    });

    if (response.ok) {
      alert('Video title updated successfully!');
    } else {
      const data = await response.json();
      alert(`Failed to update video title: ${data.error}`);
    }
  };

  return (
    <div className="min-h-screen grid grid-col-1 content-center place-content-center">
      <div className='w-96 border border-solid border-inherit p-8'>
        {session && (
          <>
            <div className='grid grid-col-1 content-center place-content-center'>
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                  {session.user.name}
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => signOut()}
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block w-full px-4 py-2 text-left text-sm'
                              )}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
            <br />
            <form onSubmit={handleSubmit}>
              <div className='mb-6'>
                <label 
                  htmlFor="videoId"
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'  
                >Video ID:</label>
                <input
                  type="text"
                  id="videoId"
                  value={videoId}
                  onChange={(e) => setVideoId(e.target.value)}
                  className='self-end max-w-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                />
              </div>
              <div className='mb-6'>
                <label 
                  htmlFor="newTitle"
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white' 
                  >New Title:</label>
                <input
                  type="text"
                  id="newTitle"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className='self-end max-w-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                />
              </div>
              <button 
                type="submit" 
                className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              >Change Video Title</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
