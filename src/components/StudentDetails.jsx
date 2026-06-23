import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function StudentDetails() {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resStudents, resSubjects, resEvaluations] = await Promise.all([
          axios.get('http://localhost:9999/students'),
          axios.get('http://localhost:9999/subjects'),
          axios.get('http://localhost:9999/evaluations')
        ]);

        const foundStudent = resStudents.data.find((item) => item.studentId === studentId);
        setStudent(foundStudent || null);
        setSubjects(resSubjects.data);
        
        const filteredEvaluations = resEvaluations.data.filter((record) => record.studentId === studentId);
        setEvaluations(filteredEvaluations);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [studentId]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">Student with ID {studentId} not found.</div>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4 fw-bold">Students Management</h1>
      <div className="mb-4 mx-auto" style={{ maxWidth: '760px' }}>
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Enter student name to search ..."
        />
      </div>
      <div className="mb-4 text-center">
        <button className="btn btn-success" onClick={() => navigate('/')}>Back to Home</button>
      </div>
      <div className="row gx-4">
        <div className="col-lg-4 mb-4">
          <div className="p-4 border rounded" style={{ minHeight: '520px' }}>
            <h4 className="mb-4">Subjects</h4>
            <div className="mb-4">
              {subjects.map((subject) => (
                <div key={subject.subjectId} className="mb-2">
                  <button
                    type="button"
                    className="btn btn-link text-primary p-0"
                    onClick={() => {}}
                  >
                    {subject.name}
                  </button>
                </div>
              ))}
            </div>
            <form>
              <div className="mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter SubjectId"
                />
              </div>
              <div className="mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter SubjectName"
                />
              </div>
              <button type="button" className="btn btn-secondary">Add</button>
            </form>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="p-4 border rounded">
            <h4 className="mb-4">{student.name}'s Grade Details:</h4>
            <div className="table-responsive">
              <table className="table table-striped table-bordered mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Grade</th>
                    <th>Explanation</th>
                  </tr>
                </thead>
                <tbody>
                  {evaluations.length > 0 ? (
                    evaluations.map((record) => (
                      <tr key={record.id}>
                        <td>{record.grade}</td>
                        <td>{record.additionalExplanation}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="text-center">No grades available.</td>
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

export default StudentDetails;
