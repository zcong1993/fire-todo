<template>
  <mu-flexbox class="content">
    <mu-flexbox-item class="flex-demo">
      <mu-card>
        <mu-card-title title="vue todos" subTitle="vue & firebase"/>
        <mu-card-text>
          <p>请确保你能够访问Google，本项目使用的后端数据库和账户认证服务均依赖于Google的firebase。</p>
          <p>现在仅支持Google账户登录。</p>
        </mu-card-text>
        <mu-card-actions>
          <mu-raised-button label="SIGN IN" class="demo-raised-button" secondary @click="handleLogin()"/>
        </mu-card-actions>
      </mu-card>
    </mu-flexbox-item>
  </mu-flexbox>
</template>

<script>
  export default {
    props: ['handleLogin']
  }
</script>

<style scoped>

</style>
