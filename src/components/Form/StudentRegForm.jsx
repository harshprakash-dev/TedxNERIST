import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentRegForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    registrationNumber: "",
    email: "",
    phone: "",
    name: "",
    rollNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [regNumError, setRegNumError] = useState("");

  useEffect(() => {
    const fetchStudentData = async () => {
      if (/^\d{6}$/.test(formData.registrationNumber)) {
        setLoading(true);
        setError("");
        try {
          const res = await fetch(
            `https://node-service-dot-splirx.as.r.appspot.com/api/student/${formData.registrationNumber}`
          );
          if (res.ok) {
            const data = await res.json();
            setFormData((prev) => ({
              ...prev,
              name: data.name || "",
              rollNumber: data.roll_number || "",
            }));
          } else {
            setFormData((prev) => ({ ...prev, name: "", rollNumber: "" }));
            setError("Student not found.");
          }
        } catch (error) {
          setError("Failed to fetch student data.");
        }
        setLoading(false);
      } else if (formData.registrationNumber.length > 0) {
        setFormData((prev) => ({ ...prev, name: "", rollNumber: "" }));
        setError(""); // Clear "Student not found" if they start typing again
      } else {
        setFormData((prev) => ({ ...prev, name: "", rollNumber: "" }));
        setError("");
        setLoading(false);
      }
    };

    const delayFetch = setTimeout(fetchStudentData, 1000);
    return () => clearTimeout(delayFetch);
  }, [formData.registrationNumber]);

  const handleRegNumChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, registrationNumber: value });
    setRegNumError("");
    if (value.length > 0 && !/^\d{0,6}$/.test(value)) {
      setRegNumError("Registration Number must contain only digits.");
    } else if (value.length > 6) {
      setRegNumError("Registration Number must be exactly 6 digits.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!/^\d{6}$/.test(formData.registrationNumber)) {
      newErrors.registrationNumber =
        "Registration Number must be exactly 6 digits.";
    }
    if (!formData.email) {
      newErrors.email = "This field is required";
    }
    if (!formData.phone) {
      newErrors.phone = "This field is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
    }
    if (!formData.name) {
      newErrors.name = "This field is required";
    }
    if (!formData.rollNumber) {
      newErrors.rollNumber = "This field is required";
    }

    setFormError(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitLoading(true);
    setSubmitMessage("");

    try {
      const studentResponse = await fetch(
        "https://node-service-dot-splirx.as.r.appspot.com/api/student",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const studentData = await studentResponse.json();

      if (studentResponse.ok) {
        const ticketPayload = {
          name: formData.name,
          email: formData.email,
          admin_name: "harsh",
          amount: 300,
        };

        const ticketResponse = await fetch(
          "https://tedx-backend-java-dot-splirx.as.r.appspot.com/api/ticket/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(ticketPayload),
          }
        );

        const ticketData = await ticketResponse.json();

        if (ticketResponse.ok) {
          setSubmitted(true);
          const submissionResponse = await fetch(
            "https://node-service-dot-splirx.as.r.appspot.com/api/submission",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                "Participant's Name": formData.name,
                link: `https://ticket.tedxnerist.com/ticket.html?ticket=${ticketData.ticket}`,
                email: formData.email,
              }),
            }
          );

          await submissionResponse.json();
        } else {
          setSubmitMessage(ticketData.message || "Ticket creation failed.");
        }
      } else if (studentResponse.status === 409) {
        setSubmitMessage("You are already registered.");
      } else {
        setSubmitMessage(studentData.message || "Failed to submit form.");
      }
    } catch (error) {
      setSubmitMessage("Error submitting form.");
    }

    setSubmitLoading(false);
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen  bg-[#1b1b1b] p-4 sm:p-6 md:p-0 font-['gilroy']">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-100 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row w-full sm:max-w-[90%] md:w-[600px] lg:w-[800px] shadow-lg"
        >
          <div className="w-full md:w-1/2 flex flex-col justify-center text-center">
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl md:text-5xl text-black font-semibold mb-6 md:mb-8 font-['Cirka']"
            >
              Thank You
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-gray-700 text-left text-sm md:text-base"
            >
              Thank you for registering for TEDx NERIST! Please remember to
              bring your student ID for entry verification. The event will take
              place at <strong>Silver Jubilee Hall</strong> on{" "}
              <strong>12th April at 2:30 PM</strong>. We look forward to seeing
              you there!
            </motion.p>
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.1, rotate: 360 }}
              className="mt-6 bg-black! text-white rounded-full px-6 py-3 flex items-center justify-center w-16 h-16 transition-transform duration-200 mx-auto"
              onClick={() => navigate("/")}
            >
              <Check size={32} />
            </motion.button>
          </div>
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-full md:w-1/2 mt-6 md:mt-0"
          >
            <img
              src="/images/Form.png"
              alt="Form Illustration"
              className="rounded-xl object-cover w-full h-full"
            />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen  bg-[#1b1b1b]! p-4 sm:p-6 md:p-0 font-['gilroy']">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-100 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row w-full sm:max-w-[90%] md:w-[600px] lg:w-[800px] shadow-lg"
      >
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-1/2 pr-0 md:pr-6 flex flex-col"
        >
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-3xl md:text-5xl text-black font-semibold mb-6 md:mb-8 mt-4 md:mt-6 font-['Cirka']"
          >
            Student Registration
          </motion.h2>
          <div className="flex flex-col gap-6">
            <motion.div
              key="registrationNumber"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="relative"
            >
              <label
                htmlFor="registrationNumber"
                className="absolute text-gray-600 text-sm"
              >
                Registration Number
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                type="text"
                name="registrationNumber"
                id="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleRegNumChange}
                className={`mt-5 p-3 border rounded-2xl focus:outline-none text-black w-full focus:ring-2 focus:ring-black ${
                  formError.registrationNumber || regNumError
                    ? "border-red-500"
                    : ""
                }`}
              />
              <AnimatePresence>
                {(formError.registrationNumber || regNumError) && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-sm"
                  >
                    {formError.registrationNumber || regNumError}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
            {[
              { name: "name", label: "Name", disabled: true },
              { name: "rollNumber", label: "Roll No.", disabled: true },
              { name: "email", label: "Email Id", type: "email" },
              { name: "phone", label: "Phone Number" },
            ].map(({ name, label, type = "text", disabled = false }, index) => (
              <motion.div
                key={name}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                className="relative"
              >
                <label
                  htmlFor={name}
                  className="absolute text-gray-600 text-sm"
                >
                  {label}
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  type={type}
                  name={name}
                  id={name}
                  value={formData[name]}
                  onChange={handleChange}
                  disabled={disabled}
                  className={`mt-5 p-3 border rounded-2xl focus:outline-none text-black w-full focus:ring-2 focus:ring-black ${
                    formError[name] ? "border-red-500" : ""
                  }`}
                />
                <AnimatePresence>
                  {formError[name] && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-sm"
                    >
                      {formError[name]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center text-gray-500 text-sm"
                >
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                    className="mr-2"
                  >
                    <Loader size={16} />
                  </motion.span>
                  Fetching data...
                </motion.div>
              )}
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-red-500 text-sm"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="submit"
              disabled={submitLoading || regNumError}
              className="mt-5 bg-black! text-white rounded-full p-4 md:p-5 cursor-pointer transition-transform duration-200"
            >
              {submitLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Loader size={24} />
                </motion.div>
              ) : (
                <ArrowRight size={24} />
              )}
            </motion.button>
          </motion.div>
          <AnimatePresence>
            {submitMessage && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-red-500 text-sm text-center mt-3"
              >
                {submitMessage}
              </motion.p>
            )}
          </AnimatePresence>
        </form>
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full md:w-1/2 mt-6 md:mt-0 md:block hidden"
        >
          <img
            src="/images/Form.png"
            alt="Form Illustration"
            className="rounded-xl object-cover w-full h-full"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
