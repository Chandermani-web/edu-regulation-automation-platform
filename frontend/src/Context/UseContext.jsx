import { useEffect, useCallback, useRef } from "react";
import { createContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [auth, setAuth] = useState(
    () => localStorage.getItem("edu-relational-automation-platform") === "true"
  );
  const [role, setRole] = useState(localStorage.getItem("userRole"));
  const [user, setUser] = useState(()=>JSON.parse(localStorage.getItem("userData")) || null);
  const [loading, setLoading] = useState(false);

  // Refs to track if data has been fetched to prevent infinite loops
  const institutionFetched = useRef(false);
  const applicationFetched = useRef(false);

  // current institution id for filling the details (parameters, documents, application)
  const [currentInstitutionId, setCurrentInstitutionId] = useState(() => {
    return localStorage.getItem("currentInstitutionId") || null;
  });

  const [currentApplicationId, setCurrentApplicationId] = useState(() => {
    return localStorage.getItem("currentApplicationId") || null;
  });

  const [currentInstitutionData, setCurrentInstitutionData] = useState(
    () => JSON.parse(localStorage.getItem("currentInstitutionData")) || null
  );

  // for users
  const [institutionDetails, setInstitutionDetails] = useState(()=>{
    return JSON.parse(localStorage.getItem("institutionDetails")) || null;
  });
  const [applicationDetails, setApplicationDetails] = useState([]);

  // for aicte/ugc super admin to get all institutions
  const [allInstitutionDetails, setAllInstitutionDetails] = useState(null);
  const [allApplicationDetails, setAllApplicationDetails] = useState(null);

  const getApiUrl = () => "http://localhost:3000";

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${getApiUrl()}/api/auth/profile`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        localStorage.setItem("edu-relational-automation-platform", "true");
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userData", JSON.stringify(data));
        setAuth(true);
        setRole(data.role);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setUser(null);
      localStorage.removeItem("edu-relational-automation-platform");
      localStorage.removeItem("userRole");
      setAuth(false);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstitutionById = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${getApiUrl()}/api/institution/my`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const result = await response.json();
        // API returns { success: true, data: [...] } where data is an array
        const data = result.data && result.data.length > 0 ? result.data[0] : null;
        
        if (data) {
          setInstitutionDetails(data);
          localStorage.setItem("institutionDetails", JSON.stringify(data));
          
          // Set currentInstitutionId only if it's different to avoid infinite loops
          if (data._id && data._id !== currentInstitutionId) {
            setCurrentInstitutionId(data._id);
            localStorage.setItem("currentInstitutionId", data._id);
          }
        } else {
          console.warn("No institution found for user");
        }
      }
    } catch (err) {
      console.error("Error fetching institution data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicationById = async () => {
    console.log('=== fetchApplicationById START ===');
    setLoading(true);
    try {
      const response = await fetch(
        `${getApiUrl()}/api/institution/application`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      console.log('fetchApplicationById - response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Application data received:', data);
        console.log('Application array:', data.application);
        console.log('Application array length:', data.application?.length);
        
        // Ensure we always set an array
        const apps = Array.isArray(data.application) ? data.application : [];
        setApplicationDetails(apps);
        console.log('setApplicationDetails called with:', apps);
        console.log('Total applications fetched:', apps.length);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch application:', response.status, errorData);
        // Set empty array on error to prevent null issues
        setApplicationDetails([]);
      }
    } catch (err) {
      console.error("Error fetching application data:", err);
      // Set empty array on error to prevent null issues
      setApplicationDetails([]);
    } finally {
      setLoading(false);
      console.log('=== fetchApplicationById END ===');
    }
  };

  const fetchAllInstitutions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${getApiUrl()}/api/institution/all`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const result = await response.json();
        console.log('All institutions data received:', result);
        // Handle both old format (array) and new format (object with data property)
        const data = result.data || result;
        setAllInstitutionDetails(data);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch all institutions:', response.status, errorData);
      }
    } catch (err) {
      console.error("Error fetching all institutions:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchAllApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${getApiUrl()}/api/institution/application/all`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log('All applications data received:', data);
        setAllApplicationDetails(data.applications);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch all applications:', response.status, errorData);
      }
    } catch (err) {
      console.error("Error fetching all applications:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const init = async () => {
      if (auth && user && !institutionFetched.current) {
        await fetchInstitutionById();
        // Only set flag to true after successful fetch
        institutionFetched.current = true;
      }
    };
    init();
  }, [auth, user]);

  console.log('currentinstitutionID:', currentInstitutionId)
  console.log('Context state - auth:', auth, 'user:', user?.email, 'role:', role);

  useEffect(() => {
      console.log('=== Application fetch useEffect triggered ===');
      console.log('auth:', auth, 'user:', user?.email, 'role:', role, 'applicationFetched:', applicationFetched.current);
      
      const init = async () => {
        if (auth && user && role && !applicationFetched.current) {
          console.log('Starting application fetch for role:', role);
          setLoading(true);
          try {
            if (role === "institution") {
              console.log('Fetching application for institution');
              await fetchApplicationById();
            } else if (role === "aicte" || role === "ugc" || role === "super_admin") {
              console.log('Fetching all institutions and applications for admin');
              await fetchAllInstitutions();
              await fetchAllApplications();
            }
            // Only set flag to true after successful fetch
            applicationFetched.current = true;
          } finally {
            setLoading(false);
          }
        }
      };
      
      init();
  }, [auth, user, role]);

  console.log(user);

  // for display the institution and application details in console for debugging
  console.log("Institution Details in Context:", institutionDetails);
  console.log("Application Details in Context:", applicationDetails);

  // for ugc and aicte
  console.log("All Institution Details in Context:", allInstitutionDetails);
  console.log("All Application Details in Context:", allApplicationDetails);

  // Refresh functions to force re-fetch data
  const refreshInstitutionData = useCallback(() => {
    institutionFetched.current = false;
    fetchInstitutionById();
  }, []);

  const refreshApplicationData = useCallback(() => {
    applicationFetched.current = false;
    if (role === "institution") {
      fetchApplicationById();
    } else if (role === "aicte" || role === "ugc" || role === "super_admin") {
      fetchAllInstitutions();
      fetchAllApplications();
    }
  }, [role]);

  const value = {
    auth,
    setAuth,
    user,
    setUser,
    role,
    loading,
    setRole,
    fetchUser,
    institutionDetails,
    fetchInstitutionById,
    refreshInstitutionData,
    applicationDetails,
    fetchApplicationById,
    refreshApplicationData,
    allInstitutionDetails,
    fetchAllInstitutions,
    allApplicationDetails,
    fetchAllApplications,
    getApiUrl,

    currentInstitutionId,
    setCurrentInstitutionId,
    currentInstitutionData,
    setCurrentInstitutionData,
    currentApplicationId,
    setCurrentApplicationId,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
