const STORAGE_KEY = "cineflix-my-list";

export function getMyList() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return [];
  }

  return JSON.parse(saved);
}

export function addToMyList(show) {
  const currentList = getMyList();

  const alreadyExists = currentList.some(
    (item) => item.id === show.id
  );

  if (alreadyExists) {
    return currentList;
  }

  const updatedList = [...currentList, show];

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedList)
  );

  return updatedList;
}

export function removeFromMyList(id) {
  const currentList = getMyList();

  const updatedList = currentList.filter(
    (show) => show.id !== id
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedList)
  );

  return updatedList;
}

export function isInMyList(id) {
  const currentList = getMyList();

  return currentList.some(
    (show) => show.id === id
  );
}