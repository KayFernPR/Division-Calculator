import JobCard from './JobCard'

const JobHistory = ({ jobs, onDeleteJob, onClearHistory }) => {
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (jobs.length === 0) {
    return (
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          📋 Job History
        </h2>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-gray-600 dark:text-gray-400">
            No jobs saved yet. Start by calculating your first job!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          📋 Job History ({jobs.length})
        </h2>
        <button
          onClick={onClearHistory}
          className="btn btn-danger text-sm"
        >
          🗑️ Clear All
        </button>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onDelete={() => onDeleteJob(job.id)}
            formatDate={formatDate}
          />
        ))}
      </div>
    </div>
  )
}

export default JobHistory 