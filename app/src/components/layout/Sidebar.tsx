import React from 'react';

const Sidebar = () => {
  return (
    <aside className="w-64 border-r p-4">
      <nav>
        <ul>
          <li><a href="#" className="block py-2 px-4 hover:bg-gray-100">Dashboard</a></li>
          <li><a href="#" className="block py-2 px-4 hover:bg-gray-100">Customers</a></li>
          <li><a href="#" className="block py-2 px-4 hover:bg-gray-100">Projects</a></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
