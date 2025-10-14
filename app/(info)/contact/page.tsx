// app/(info)/contact/page.tsx

export default function ContactPage() {
  return (
    <section className="container py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Contact Us</h1>
      <p className="text-gray-600 mb-8">
        Have questions? We’d love to hear from you. Reach out to us using the
        form below or via WhatsApp.
      </p>

      <form className="grid gap-6 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            className="w-full border rounded-md p-2 focus:ring focus:ring-gray-300"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full border rounded-md p-2 focus:ring focus:ring-gray-300"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            className="w-full border rounded-md p-2 focus:ring focus:ring-gray-300"
            rows={5}
            placeholder="Write your message..."
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition"
        >
          Send Message
        </button>
      </form>
    </section>
  );
}
