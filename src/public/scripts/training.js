async function getAllCourses(){
    const courses = await fetch('http://localhost:8080/api/courses')
    .then(data=> data.json())

    console.log(courses)
}