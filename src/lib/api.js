const API_BASE_URL = "api"; // eziga backend api chemirubet

export async function fetchDoctorProfiles(page = 1, pageSize = 10) {
  const response = await fetch(
    `${API_BASE_URL}/doctors/profiles/?page=${page}&page_size=${pageSize}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch doctor profiles: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchDoctorProfile(id) {
  const response = await fetch(`${API_BASE_URL}/doctors/profiles/${id}/`);

  if (!response.ok) {
    throw new Error(`Failed to fetch doctor profile: ${response.statusText}`);
  }

  return response.json();
}

export async function createDoctorProfile(data) {
  const response = await fetch(`${API_BASE_URL}/doctors/profiles/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create doctor profile: ${response.statusText}`);
  }

  return response.json();
}

export async function updateDoctorProfile(id, data) {
  const response = await fetch(`${API_BASE_URL}/doctors/profiles/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update doctor profile: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteDoctorProfile(id) {
  const response = await fetch(`${API_BASE_URL}/doctors/profiles/${id}/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete doctor profile: ${response.statusText}`);
  }
}

// Availability API
export async function fetchAvailability(
  page = 1,
  doctorId = null,
  pageSize = 10
) {
  let url = `${API_BASE_URL}/doctors/availability/?page=${page}&page_size=${pageSize}`;

  if (doctorId) {
    url += `&doctor=${doctorId}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch availability: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchAvailabilityById(id) {
  const response = await fetch(`${API_BASE_URL}/doctors/availability/${id}/`);

  if (!response.ok) {
    throw new Error(`Failed to fetch availability: ${response.statusText}`);
  }

  return response.json();
}

export async function createAvailability(data) {
  const response = await fetch(`${API_BASE_URL}/doctors/availability/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create availability: ${response.statusText}`);
  }

  return response.json();
}

export async function updateAvailability(id, data) {
  const response = await fetch(`${API_BASE_URL}/doctors/availability/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update availability: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteAvailability(id) {
  const response = await fetch(`${API_BASE_URL}/doctors/availability/${id}/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete availability: ${response.statusText}`);
  }
}
