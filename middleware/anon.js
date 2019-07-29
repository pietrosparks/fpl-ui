export default function({ store, redirect }) {
  const { user } = store.state
  if (user) {
    return redirect("/home")
  }
}
