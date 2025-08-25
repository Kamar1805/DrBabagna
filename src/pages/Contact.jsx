export default function Contact() {
    return (
      <main>
        <h1>Contact</h1>
        <p>Email: <a href="mailto:professional@email.com">professional@email.com</a></p>
        <p>LinkedIn: <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">View profile</a></p>
        <form onSubmit={(e) => e.preventDefault()} noValidate>
          <label>
            <span>Name</span>
            <input type="text" name="name" required />
          </label>
          <label>
            <span>Email</span>
            <input type="email" name="email" required />
          </label>
          <label>
            <span>Message</span>
            <textarea name="message" rows={5} required />
          </label>
          <button type="submit">Submit</button>
        </form>
      </main>
    )
  }