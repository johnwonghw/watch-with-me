function generateId() {
	return Math.random().toString(12).substr(2, 9);
}

export default {
  generateId
}