import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import database from '../data';

const studentDetailsByStudent = database.student_details.reduce((map, record) => {
  map[record.studentId] = record;
  return map;
}, {});

function StudentsManagement() {
  const [searchText, setSearchText] = useState('');
  const [subjects, setSubjects] = useState(() => {
    const storedSubjects = localStorage.getItem('subjects');
    if (storedSubjects) {
      try {
        return JSON.parse(storedSubjects);
      } catch {
        return database.subjects;
      }
    }
    return database.subjects;
  });
  const [newSubjectId, setNewSubjectId] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [subjectIdError, setSubjectIdError] = useState('');
  const [subjectNameError, setSubjectNameError] = useState('');
  const [searchParams] = useSearchParams();
  const selectedSubject = searchParams.get('subject') || '';

  const filteredStudents = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return database.students
      .filter((student) => {
        const matchesSearch = !query || student.name.toLowerCase().startsWith(query);
        const matchesSubject = !selectedSubject
          ? true
          : database.students_subjetcs.some(
              (entry) => entry.studentId === student.studentId && entry.subjectId === selectedSubject
            );
        return matchesSearch && matchesSubject;
      })
      .map((student) => ({
        ...student,
        detail: studentDetailsByStudent[student.studentId] || { address: { street: '', city: '' } }
      }));
  }, [searchText, selectedSubject]);

  const handleAddSubject = (event) => {
    event.preventDefault();
    const subjectIdValue = newSubjectId.trim();
    const subjectNameValue = newSubjectName.trim();
    let hasError = false;

    if (!subjectIdValue) {
      setSubjectIdError('SubjectId not empty');
      hasError = true;
    } else {
      setSubjectIdError('');
    }

    if (!subjectNameValue) {
      setSubjectNameError('SubjectName not empty');
      hasError = true;
    } else {
      setSubjectNameError('');
    }

    if (hasError) {
      return;
    }

    const nextId = subjects.length > 0 ? Math.max(...subjects.map((item) => item.id)) + 1 : 1;
    const nextSubjects = [
      ...subjects,
      { id: nextId, subjectId: subjectIdValue, name: subjectNameValue }
    ];
    setSubjects(nextSubjects);
    localStorage.setItem('subjects', JSON.stringify(nextSubjects));
    setNewSubjectId('');
    setNewSubjectName('');
    alert('Add new subject success');
    window.location.reload();
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4 fw-bold">Students Management</h1>
      <div className="mb-4 mx-auto" style={{ maxWidth: '760px' }}>
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Enter student name to search ..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <div className="row gx-4">
        <div className="col-lg-4 mb-4">
          <div className="p-4 border rounded" id="subject-list">
            <h4 className="mb-4">Subjects</h4>
            <div className="mb-4">
              {subjects.map((subject) => (
                <div key={subject.subjectId} className="mb-2">
                  <Link
                    to={`/student?subject=${subject.subjectId}`}
                    className={`text-decoration-none ${selectedSubject === subject.subjectId ? 'fw-bold text-primary' : 'text-primary'}`}
                  >
                    {subject.name}
                  </Link>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddSubject}>
              <div className="mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter SubjectId"
                  value={newSubjectId}
                  onChange={(e) => setNewSubjectId(e.target.value)}
                />
                {subjectIdError && <div className="text-danger small mt-1">{subjectIdError}</div>}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter SubjectName"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                />
                {subjectNameError && <div className="text-danger small mt-1">{subjectNameError}</div>}
              </div>
              <button type="submit" className="btn btn-outline-secondary">Add</button>
            </form>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="p-4 border rounded">
            <h4 className="mb-4">List of Students</h4>
            <div className="table-responsive">
              <table className="table table-bordered align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>StudentId</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Street</th>
                    <th>City</th>
                    <th>IsRegularStudent</th>
                    <th>View grades</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr key={student.studentId}>
                        <td>{student.studentId}</td>
                        <td>{student.name}</td>
                        <td>{student.age}</td>
                        <td>{student.detail.address.street}</td>
                        <td>{student.detail.address.city}</td>
                        <td>{student.isRegularStudent ? 'Fulltime' : 'Applicant'}</td>
                        <td>
                          <Link to={`/student/${student.studentId}`} className="text-primary">
                            Grades
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-4">No students found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <footer className="text-center mt-4 pt-3 border-top">Copyright by: HExxxxxx</footer>
    </div>
  );
}

export default StudentsManagement;
