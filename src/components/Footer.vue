<template> 
  <div id="footer">
    <div class="footer__bg d-flex justify-content-center align-items-center">
      <span class="d-flex text-center">STAR WARS CHARACTER Encyclopedia, 2019</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
}
</script>


<style scoped="scoped">

.footer__bg{
  width: 100vw;
  height: 120px;
  background: #1A1A1A;
}
.footer__bg span{
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 21px;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  font-feature-settings: 'cpsp' on;
  color: #FFFFFF;
}

@media(max-width: 767px){
  .footer__bg span{
    margin-left: 61px;
    margin-right: 61px;
  }
}
</style>