<script>
export default {
  created() {
    const {params, query} = this.$route;
    const {path} = params;
    // 在path前面添加/来重定向路由，然后再渲染
    this.$router.replace({path: '/' + path, query});
  },
  render: (h) => {
    return h(); // avoid warning message
  }
}
</script>
