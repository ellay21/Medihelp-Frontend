import React, { useState } from 'react';

const NearbyClinics = () => {
  const [filterName, setFilterName] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('All');

  const clinics = [
    {
      id: 1,
      name: 'Addis Hiwot General Hospital',
      rating: 1.7,
      contact: '+251 11 618 0449',
      location: 'Bole Sub-city, Wereda 4, Addis Ababa',
      specialty: 'General',
      feedback: 'The facility isn\'t adequate for a hospital, but the doctors are great and nurses were friendly.',
      image: 'Addish',
      link: 'http://addishiwotgeneralhospital.com'
    },
    {
      id: 2,
      name: 'St. Gabriel General Hospital',
      rating: 4.3,
      contact: '+251 11 662 4942',
      location: 'Addis Ababa',
      specialty: 'General',
      feedback: 'As a foreigner, I had low expectations, but the service was excellent with little wait time.',
      image: 'Saint',
      link: 'http://saintgabrielgeneralhospital.com'
    },
    {
      id: 3,
      name: 'Kadisco General Hospital',
      rating: 4.5,
      contact: '+251 11 629 8902',
      location: 'Gerji, Addis Ababa',
      specialty: 'General',
      feedback: 'Known for modern practices, very reliable for general surgery and orthopedics.',
      image: 'Kadisco',
      link: 'http://www.kadcogroup.com'
    },
    {
      id: 4,
      name: 'Nordic Medical Centre',
      rating: 4.8,
      contact: '+251 929 105 653',
      location: 'Bole Sub-city, Kebele 01, Addis Ababa',
      specialty: 'Emergency Medicine',
      feedback: 'High-quality care, preferred by internationals, excellent staff.',
      image: 'Nordic',
      link: 'http://nordicmedicalcentre.com'
    },
    {
      id: 5,
      name: 'Teklehaimanot General Hospital',
      rating: 2.1,
      contact: '+251 11 551 4141',
      location: 'Gobena Aba Tigu St, Addis Ababa',
      specialty: 'General',
      feedback: 'Service could improve, but useful for research data on diabetes.',
      image: 'Tekle',
      link: null
    },
    {
      id: 6,
      name: 'Anania Mothers and Children Specialized Medical Center',
      rating: 3.5,
      contact: '+251 11 156 5045',
      location: 'Arbeynoch St, Addis Ababa',
      specialty: 'Pediatrics',
      feedback: 'Great for prenatal care, though limited specialties.',
      image: 'Anania',
      link: null
    },
    {
      id: 7,
      name: 'Hayat Hospital',
      rating: 2.1,
      contact: '+251 11 662 4488',
      location: 'Bole Sub-city, Addis Ababa',
      specialty: 'General',
      feedback: 'Service can be disrespectful, with occasional misdiagnosis.',
      image: 'Hayat',
      link: 'http://hayatmcollege.com'
    },
    {
      id: 8,
      name: 'Addis Cardiac Hospital',
      rating: 4.6,
      contact: '+251 911 243 274',
      location: 'Addis Ababa',
      specialty: 'Cardiology',
      feedback: 'Excellent for cardiovascular care, highly specialized.',
      image: 'Addisc',
      link: null
    },
    {
      id: 9,
      name: 'Yekatit 12 Hospital',
      rating: 3.8,
      contact: '+251 11 155 3065',
      location: 'Piazza, Addis Ababa',
      specialty: 'Obstetrics',
      feedback: 'Affordable and accessible, great for obstetrics and gynecology.',
      image: 'Yekatit',
      link: null
    },
    {
      id: 10,
      name: 'Landmark General Hospital',
      rating: 3.1,
      contact: '+251 11 552 5463',
      location: 'Mozambique St, Addis Ababa',
      specialty: 'General',
      feedback: 'Poor experience with rude staff, needs better management.',
      image: 'Land',
      link: 'http://landmarkhospital.et'
    },
    {
      id: 11,
      name: 'CURE Ethiopia',
      rating: 4.7,
      contact: '+251 11 123 7767',
      location: 'Addis Ababa',
      specialty: 'Orthopedics',
      feedback: 'Amazing for pediatric orthopedics, very compassionate care.',
      image: 'Cure',
      link: 'http://cure.org'
    },
    {
      id: 12,
      name: 'Ethio Tebib General Hospital',
      rating: 3.2,
      contact: '+251 11 551 4141',
      location: 'Sefere Selam, Addis Ababa',
      specialty: 'Maternity',
      feedback: 'Maternity ward is excellent, doctors are committed.',
      image: 'Ethio',
      link: null
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < rating ? 'text-yellow-500' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return stars;
  };

  const filteredClinics = clinics.filter(clinic => 
    clinic.name.toLowerCase().includes(filterName.toLowerCase()) &&
    (filterSpecialty === 'All' || clinic.specialty === filterSpecialty)
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Nearby Clinics</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <select
          value={filterSpecialty}
          onChange={(e) => setFilterSpecialty(e.target.value)}
          className="border p-2 rounded w-full mt-2"
        >
          <option value="All">All Specialties</option>
          {Array.from(new Set(clinics.map(clinic => clinic.specialty))).map((specialty, index) => (
            <option key={index} value={specialty}>{specialty}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClinics.map(clinic => (
          <div key={clinic.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{clinic.name}</h2>
            <p>Rating: {renderStars(clinic.rating)}</p>
            <p>Contact: {clinic.contact}</p>
            <p>Location: {clinic.location}</p>
            <p>Specialty: {clinic.specialty}</p>
            <p>Feedback: {clinic.feedback}</p>
            {clinic.link && <a href={clinic.link} className="text-blue-500">Visit Website</a>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyClinics;