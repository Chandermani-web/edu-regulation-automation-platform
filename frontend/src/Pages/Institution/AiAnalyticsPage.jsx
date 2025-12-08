import React, { useContext, useState } from 'react'
import AppContext from '../../Context/UseContext'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'

const AiAnalyticsPage = () => {
    const navigate = useNavigate()
  const { currentApplicationId } = useContext(AppContext)
  const [loading, setLoading] = useState(false)

  const handleFetchAnalytics = async () => {
    if (!currentApplicationId) {
      toast.error("Application ID not found ❌")
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        `http://localhost:3000/api/ai-analysis/process/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({ applicationId: currentApplicationId })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "AI Analysis failed")
      }

      if(response.ok){
          toast.success("AI Analysis Completed Successfully ✅", {
            position: "top-center",
            autoClose: 3000,
            onClose: ()=>{
                navigate('/institution/application')
            }
          })
      }

      console.log("✅ Analysis data:", data)

    } catch (error) {
      console.error("❌ Error:", error)
      toast.error(error.message || "AI Analysis failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 flex flex-col items-center gap-6">

      <h2 className="text-2xl font-bold">AI Analysis Panel</h2>

      <button
        onClick={handleFetchAnalytics}
        disabled={loading}
        className={`px-6 py-3 rounded-lg text-white font-semibold 
        ${loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        {loading ? "Processing..." : "Run AI Analysis"}
      </button>

      <ToastContainer />
    </div>
  )
}

export default AiAnalyticsPage