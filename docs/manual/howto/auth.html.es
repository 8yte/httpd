<?xml version="1.0" encoding="ISO-8859-1"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="es" xml:lang="es"><head>
<meta content="text/html; charset=ISO-8859-1" http-equiv="Content-Type" />
<!--
        XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
              This file is generated from xml source: DO NOT EDIT
        XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
      -->
<title>Autenticaci�n y Autorizaci�n - Servidor HTTP Apache Versi�n 2.5</title>
<link href="../style/css/manual.css" rel="stylesheet" media="all" type="text/css" title="Main stylesheet" />
<link href="../style/css/manual-loose-100pc.css" rel="alternate stylesheet" media="all" type="text/css" title="No Sidebar - Default font size" />
<link href="../style/css/manual-print.css" rel="stylesheet" media="print" type="text/css" /><link rel="stylesheet" type="text/css" href="../style/css/prettify.css" />
<script src="../style/scripts/prettify.min.js" type="text/javascript">
</script>

<link href="../images/favicon.ico" rel="shortcut icon" /></head>
<body id="manual-page"><div id="page-header">
<p class="menu"><a href="../mod/">M�dulos</a> | <a href="../mod/quickreference.html">Directivas</a> | <a href="http://wiki.apache.org/httpd/FAQ">Preguntas Frecuentes</a> | <a href="../glossary.html">Glosario</a> | <a href="../sitemap.html">Mapa del sitio web</a></p>
<p class="apache">Versi�n 2.5 del Servidor HTTP Apache</p>
<img alt="" src="../images/feather.png" /></div>
<div class="up"><a href="./"><img title="&lt;-" alt="&lt;-" src="../images/left.gif" /></a></div>
<div id="path">
<a href="http://www.apache.org/">Apache</a> &gt; <a href="http://httpd.apache.org/">Servidor HTTP</a> &gt; <a href="http://httpd.apache.org/docs/">Documentaci�n</a> &gt; <a href="../">Versi�n 2.5</a> &gt; <a href="./">How-To / Tutoriales</a></div><div id="page-content"><div id="preamble"><h1>Autenticaci�n y Autorizaci�n</h1>
<div class="toplang">
<p><span>Idiomas disponibles: </span><a href="../en/howto/auth.html" hreflang="en" rel="alternate" title="English">&nbsp;en&nbsp;</a> |
<a href="../es/howto/auth.html" title="Espa�ol">&nbsp;es&nbsp;</a> |
<a href="../fr/howto/auth.html" hreflang="fr" rel="alternate" title="Fran�ais">&nbsp;fr&nbsp;</a> |
<a href="../ja/howto/auth.html" hreflang="ja" rel="alternate" title="Japanese">&nbsp;ja&nbsp;</a> |
<a href="../ko/howto/auth.html" hreflang="ko" rel="alternate" title="Korean">&nbsp;ko&nbsp;</a> |
<a href="../tr/howto/auth.html" hreflang="tr" rel="alternate" title="T�rk�e">&nbsp;tr&nbsp;</a></p>
</div>

    <p>Autenticaci�n es cualquier proceso por el cu�l se verifica que uno es 
    quien dice ser. Autorizaci�n es cualquier proceso en el cu�l cualquiera
    est� permitido a estar donde se quiera, o tener informaci�n la cu�l se
    quiera tener.
    </p>

    <p>Para informaci�n de control de acceso de forma gen�rica visite<a href="access.html">How to de Control de Acceso</a>.</p>
</div>
<div id="quickview"><ul id="toc"><li><img alt="" src="../images/down.gif" /> <a href="#related">M�dulos y Directivas Relacionados</a></li>
<li><img alt="" src="../images/down.gif" /> <a href="#introduction">Introducci�n</a></li>
<li><img alt="" src="../images/down.gif" /> <a href="#theprerequisites">Los Prerequisitos</a></li>
<li><img alt="" src="../images/down.gif" /> <a href="#gettingitworking">Conseguir que funcione</a></li>
<li><img alt="" src="../images/down.gif" /> <a href="#lettingmorethanonepersonin">Dejar que m�s de una persona 
	entre</a></li>
<li><img alt="" src="../images/down.gif" /> <a href="#possibleproblems">Posibles Problemas</a></li>
<li><img alt="" src="../images/down.gif" /> <a href="#dbmdbd">M�todo alternativo de almacenamiento de las 
	contrase�as</a></li>
<li><img alt="" src="../images/down.gif" /> <a href="#multprovider">Uso de m�ltiples proveedores</a></li>
<li><img alt="" src="../images/down.gif" /> <a href="#beyond">M�s all� de la Autorizaci�n</a></li>
<li><img alt="" src="../images/down.gif" /> <a href="#socache">Authentication Caching</a></li>
<li><img alt="" src="../images/down.gif" /> <a href="#moreinformation">More information</a></li>
</ul><h3>Consulte tambi�n</h3><ul class="seealso"><li><a href="#comments_section">Comentarios</a></li></ul></div>
<div class="top"><a href="#page-header"><img alt="top" src="../images/up.gif" /></a></div>
<div class="section">
<h2><a name="related" id="related">M�dulos y Directivas Relacionados</a></h2>

<p>Hay tres tipos de m�dulos involucrados en los procesos de la autenticaci�n 
	y autorizaci�n. Normalmente deber�s escoger al menos un m�dulo de cada grupo.</p>

<ul>
  <li>Modos de Autenticaci�n (consulte la directiva
      <code class="directive"><a href="../mod/mod_authn_core.html#authtype">AuthType</a></code> )
    <ul>
      <li><code class="module"><a href="../mod/mod_auth_basic.html">mod_auth_basic</a></code></li>
      <li><code class="module"><a href="../mod/mod_auth_digest.html">mod_auth_digest</a></code></li>
    </ul>
  </li>
  <li>Proveedor de Autenticaci�n (consulte la directiva
  <code class="directive"><a href="../mod/mod_auth_basic.html#authbasicprovider">AuthBasicProvider</a></code> y
  <code class="directive"><a href="../mod/mod_auth_digest.html#authdigestprovider">AuthDigestProvider</a></code>)

    <ul>
      <li><code class="module"><a href="../mod/mod_authn_anon.html">mod_authn_anon</a></code></li>
      <li><code class="module"><a href="../mod/mod_authn_dbd.html">mod_authn_dbd</a></code></li>
      <li><code class="module"><a href="../mod/mod_authn_dbm.html">mod_authn_dbm</a></code></li>
      <li><code class="module"><a href="../mod/mod_authn_file.html">mod_authn_file</a></code></li>
      <li><code class="module"><a href="../mod/mod_authnz_ldap.html">mod_authnz_ldap</a></code></li>
      <li><code class="module"><a href="../mod/mod_authn_socache.html">mod_authn_socache</a></code></li>
    </ul>
  </li>
  <li>Autorizaci�n (consulte la directiva
      <code class="directive"><a href="../mod/mod_authz_core.html#require">Require</a></code>)
    <ul>
      <li><code class="module"><a href="../mod/mod_authnz_ldap.html">mod_authnz_ldap</a></code></li>
      <li><code class="module"><a href="../mod/mod_authz_dbd.html">mod_authz_dbd</a></code></li>
      <li><code class="module"><a href="../mod/mod_authz_dbm.html">mod_authz_dbm</a></code></li>
      <li><code class="module"><a href="../mod/mod_authz_groupfile.html">mod_authz_groupfile</a></code></li>
      <li><code class="module"><a href="../mod/mod_authz_host.html">mod_authz_host</a></code></li>
      <li><code class="module"><a href="../mod/mod_authz_owner.html">mod_authz_owner</a></code></li>
      <li><code class="module"><a href="../mod/mod_authz_user.html">mod_authz_user</a></code></li>
    </ul>
  </li>
</ul>

  <p>A parte de �stos m�dulos, tambi�n est�n
  <code class="module"><a href="../mod/mod_authn_core.html">mod_authn_core</a></code> y
  <code class="module"><a href="../mod/mod_authz_core.html">mod_authz_core</a></code>. �stos m�dulos implementan las directivas 
  esenciales que son el centro de todos los m�dulos de autenticaci�n.</p>

  <p>El m�dulo <code class="module"><a href="../mod/mod_authnz_ldap.html">mod_authnz_ldap</a></code> es tanto un proveedor de 
  autenticaci�n como de autorizaci�n. El m�dulo
  <code class="module"><a href="../mod/mod_authz_host.html">mod_authz_host</a></code> proporciona autorizaci�n y control de acceso
  basado en el nombre del Host, la direcci�n IP o caracter�sticas de la propia
  petici�n, pero no es parte del sistema proveedor de 
  autenticaci�n. Para tener compatibilidad inversa con el mod_access, 
  hay un nuevo modulo llamado <code class="module"><a href="../mod/mod_access_compat.html">mod_access_compat</a></code>.</p>

  <p>Tambi�n puedes mirar el how-to de <a href="access.html">Control de Acceso </a>, donde se plantean varias formas del control de acceso al servidor.</p>

</div><div class="top"><a href="#page-header"><img alt="top" src="../images/up.gif" /></a></div>
<div class="section">
<h2><a name="introduction" id="introduction">Introducci�n</a></h2>
    <p>Si se tiene informaci�n en nuestra p�gina web que sea informaci�n 
    	sensible o pensada para un grupo reducido de usuarios/personas,
    	las t�cnicas que se describen en este manual, le servir�n  
    	de ayuda para asegurarse de que las personas que ven esas p�ginas sean 
    	las personas que uno quiere.</p>

    <p>Este art�culo cubre la parte "est�ndar" de c�mo proteger partes de un 
    	sitio web que muchos usar�n.</p>

    <div class="note"><h3>Nota:</h3>
    <p>Si de verdad es necesario que tus datos est�n en un sitio seguro, 
    	considera usar <code class="module"><a href="../mod/mod_ssl.html">mod_ssl</a></code>  como m�todo de autenticaci�n adicional a cualquier forma de autenticaci�n.</p>
    </div>
</div><div class="top"><a href="#page-header"><img alt="top" src="../images/up.gif" /></a></div>
<div class="section">
<h2><a name="theprerequisites" id="theprerequisites">Los Prerequisitos</a></h2>
    <p>Las directivas que se usan en este art�culo necesitaran ponerse ya sea 
    	en el fichero de configuraci�n principal del servidor ( t�picamente en 
    	la secci�n 
    <code class="directive"><a href="../mod/core.html#directory">&lt;Directory&gt;</a></code> de httpd.conf ), o
    en cada uno de los ficheros de configuraciones del propio directorio
    (los archivos <code>.htaccess</code>).</p>

    <p>Si planea usar los ficheros <code>.htaccess</code> , necesitar�s
    tener en la configuraci�n global del servidor, una configuraci�n que permita
    poner directivas de autenticaci�n en estos ficheros. Esto se hace con la
    directiva <code class="directive"><a href="../mod/core.html#allowoverride">AllowOverride</a></code>, la cual especifica
    que directivas, en su caso, pueden ser puestas en cada fichero de configuraci�n
    por directorio.</p>

    <p>Ya que estamos hablando aqu� de autenticaci�n, necesitar�s una directiva 
    	<code class="directive"><a href="../mod/core.html#allowoverride">AllowOverride</a></code> como la siguiente:
    	</p>

    <pre class="prettyprint lang-config">AllowOverride AuthConfig</pre>


    <p>O, si solo se van a poner las directivas directamente en la configuraci�n
    	principal del servidor, deber�s tener, claro est�, permisos de escritura
    	en el archivo. </p>

    <p>Y necesitar�s saber un poco de como est� estructurado el �rbol de 
    	directorios de tu servidor, para poder saber donde se encuentran algunos 
    	archivos. Esto no deber�a ser una tarea dif�cil, a�n as� intentaremos 
    	dejarlo claro llegado el momento de comentar dicho aspecto.</p>

    <p>Tambi�n deber�s de asegurarte de que los m�dulos 
    <code class="module"><a href="../mod/mod_authn_core.html">mod_authn_core</a></code> y <code class="module"><a href="../mod/mod_authz_core.html">mod_authz_core</a></code>
    han sido incorporados, o a�adidos a la hora de compilar en tu binario httpd o
    cargados mediante el archivo de configuraci�n <code>httpd.conf</code>. Estos 
    dos m�dulos proporcionan directivas b�sicas y funcionalidades que son cr�ticas
    para la configuraci�n y uso de autenticaci�n y autorizaci�n en el servidor web.</p>
</div><div class="top"><a href="#page-header"><img alt="top" src="../images/up.gif" /></a></div>
<div class="section">
<h2><a name="gettingitworking" id="gettingitworking">Conseguir que funcione</a></h2>
    <p>Aqu� est� lo b�sico de c�mo proteger con contrase�a un directorio en tu
     servidor.</p>

    <p>Primero, necesitar�s crear un fichero de contrase�a. Dependiendo de que 
    	proveedor de autenticaci�n se haya elegido, se har� de una forma u otra. Para empezar, 
    	usaremos un fichero de contrase�a de tipo texto.</p>

    <p>Este fichero deber� estar en un sitio que no se pueda tener acceso desde
     la web. Esto tambi�n implica que nadie pueda descargarse el fichero de 
     contrase�as. Por ejemplo, si tus documentos est�n guardados fuera de
     <code>/usr/local/apache/htdocs</code>, querr�s poner tu archivo de contrase�as en 
     <code>/usr/local/apache/passwd</code>.</p>

    <p>Para crear el fichero de contrase�as, usa la utilidad 
    	<code class="program"><a href="../programs/htpasswd.html">htpasswd</a></code> que viene con Apache. Esta herramienta se 
    	encuentra en el directorio <code>/bin</code> en donde sea que se ha 
    	instalado el Apache. Si ha instalado Apache desde un paquete de terceros, 
    	puede ser que se encuentre en su ruta de ejecuci�n.</p>

    <p>Para crear el fichero, escribiremos:</p>

    <div class="example"><p><code>
      htpasswd -c /usr/local/apache/passwd/passwords rbowen
    </code></p></div>

    <p><code class="program"><a href="../programs/htpasswd.html">htpasswd</a></code> te preguntar� por una contrase�a, y despu�s 
    te pedir� que la vuelvas a escribir para confirmarla:</p>

    <div class="example"><p><code>
      $ htpasswd -c /usr/local/apache/passwd/passwords rbowen<br />
      New password: mypassword<br />
      Re-type new password: mypassword<br />
      Adding password for user rbowen
    </code></p></div>

    <p>Si <code class="program"><a href="../programs/htpasswd.html">htpasswd</a></code> no est� en tu variable de entorno "path" del 
    sistema, por supuesto deber�s escribir la ruta absoluta del ejecutable para 
    poder hacer que se ejecute. En una instalaci�n por defecto, est� en:
    <code>/usr/local/apache2/bin/htpasswd</code></p>

    <p>Lo pr�ximo que necesitas, ser� configurar el servidor para que pida una 
    	contrase�a y as� decirle al servidor que usuarios est�n autorizados a acceder.
    	Puedes hacer esto ya sea editando el fichero <code>httpd.conf</code>
    de configuraci�n  o usando in fichero <code>.htaccess</code>. Por ejemplo, 
    si quieres proteger el directorio
    <code>/usr/local/apache/htdocs/secret</code>, puedes usar las siguientes 
    directivas, ya sea en el fichero <code>.htaccess</code> localizado en
    following directives, either placed in the file
    <code>/usr/local/apache/htdocs/secret/.htaccess</code>, o
    en la configuraci�n global del servidor <code>httpd.conf</code> dentro de la
    secci�n &lt;Directory  
    "/usr/local/apache/htdocs/secret"&gt; , como se muestra a continuaci�n:</p>

    <pre class="prettyprint lang-config">&lt;Directory "/usr/local/apache/htdocs/secret"&gt;
AuthType Basic
AuthName "Restricted Files"
# (Following line optional)
AuthBasicProvider file
AuthUserFile "/usr/local/apache/passwd/passwords"
Require user rbowen
&lt;/Directory&gt;</pre>


    <p>Vamos a explicar cada una de las directivas individualmente.
    	La directiva <code class="directive"><a href="../mod/mod_authn_core.html#authtype">AuthType</a></code> selecciona el m�todo
    que se usa para autenticar al usuario. El m�todo m�s com�n es 
    <code>Basic</code>, y �ste es el m�todo que implementa 
    <code class="module"><a href="../mod/mod_auth_basic.html">mod_auth_basic</a></code>. Es muy importante ser consciente,
    de que la autenticaci�n b�sica, env�a las contrase�as desde el cliente 
    al servidor sin cifrar.
    Este m�todo por tanto, no debe ser utilizado para proteger datos muy sensibles,
    a no ser que, este m�todo de autenticaci�n b�sica, sea acompa�ado del m�dulo
    <code class="module"><a href="../mod/mod_ssl.html">mod_ssl</a></code>.
    Apache soporta otro m�todo m�s de autenticaci�n  que es del tipo 
    <code>AuthType Digest</code>. Este m�todo, es implementado por el m�dulo <code class="module"><a href="../mod/mod_auth_digest.html">mod_auth_digest</a></code> y con el se pretend�a crear una autenticaci�n m�s
    segura. Este ya no es el caso, ya que la conexi�n deber� realizarse con  <code class="module"><a href="../mod/mod_ssl.html">mod_ssl</a></code> en su lugar.
    </p>

    <p>La directiva <code class="directive"><a href="../mod/mod_authn_core.html#authname">AuthName</a></code> 
    establece el <dfn>Realm</dfn> para ser usado en la autenticaci�n. El 
    <dfn>Realm</dfn> tiene dos funciones principales.
    La primera, el cliente presenta a menudo esta informaci�n al usuario como 
    parte del cuadro de di�logo de contrase�a. La segunda, que es utilizado por 
    el cliente para determinar qu� contrase�a enviar a para una determinada zona 
    de autenticaci�n.</p>

    <p>As� que, por ejemple, una vez que el cliente se ha autenticado en el �rea de
    los <code>"Ficheros Restringidos"</code>, entonces re-intentar� autom�ticamente
    la misma contrase�a para cualquier �rea en el mismo servidor que es marcado 
    con el Realm de <code>"Ficheros Restringidos"</code>
    Por lo tanto, puedes prevenir que a un usuario se le pida mas de una vez por su
    contrase�a, compartiendo as� varias �reas restringidas el mismo Realm
    Por supuesto, por razones de seguridad, el cliente pedir� siempre por una contrase�a, 
    siempre y cuando el nombre del servidor cambie.
    </p>

    <p>La directiva <code class="directive"><a href="../mod/mod_auth_basic.html#authbasicprovider">AuthBasicProvider</a></code> es,
    en este caso, opcional, ya que <code>file</code> es el valor por defecto
    para esta directiva. Deber�s usar esta directiva si estas usando otro medio
    diferente para la autenticaci�n, como por ejemplo
    <code class="module"><a href="../mod/mod_authn_dbm.html">mod_authn_dbm</a></code> o <code class="module"><a href="../mod/mod_authn_dbd.html">mod_authn_dbd</a></code>.</p>

    <p>La directiva <code class="directive"><a href="../mod/mod_authn_file.html#authuserfile">AuthUserFile</a></code>
    establece el path al fichero de contrase�as que acabamos de crear con el 
    comando <code class="program"><a href="../programs/htpasswd.html">htpasswd</a></code>. Si tiene un n�mero muy grande de usuarios, 
    puede ser realmente lento el buscar el usuario en ese fichero de texto plano 
    para autenticar a los usuarios en cada petici�n.
    Apache tambi�n tiene la habilidad de almacenar informaci�n de usuarios en 
    unos ficheros de r�pido acceso a modo de base de datos.
    El m�dulo <code class="module"><a href="../mod/mod_authn_dbm.html">mod_authn_dbm</a></code> proporciona la directiva <code class="directive"><a href="../mod/mod_authn_dbm.html#authdbmuserfile">AuthDBMUserFile</a></code>. Estos ficheros pueden ser creados y
    manipulados con el programa <code class="program"><a href="../programs/dbmmanage.html">dbmmanage</a></code> y <code class="program"><a href="../programs/htdbm.html">htdbm</a></code>. 
    Muchos otros m�todos de autenticaci�n as� como otras opciones, est�n disponibles en 
    m�dulos de terceros 
    <a href="http://modules.apache.org/">Base de datos de M�dulos disponibles</a>.</p>

    <p>Finalmente, la directiva <code class="directive"><a href="../mod/mod_authz_core.html#require">Require</a></code>
    proporciona la parte del proceso de autorizaci�n estableciendo el o los
    usuarios que se les est� permitido acceder a una regi�n del servidor.
    En la pr�xima secci�n, discutiremos las diferentes v�as de utilizar la 
    directiva <code class="directive"><a href="../mod/mod_authz_core.html#require">Require</a></code>.</p>
</div><div class="top"><a href="#page-header"><img alt="top" src="../images/up.gif" /></a></div>
<div class="section">
<h2><a name="lettingmorethanonepersonin" id="lettingmorethanonepersonin">Dejar que m�s de una persona 
	entre</a></h2>
    <p>Las directivas mencionadas arriba s�lo permiten a una persona 
    (especialmente con un usuario que en ej ejemplo es <code>rbowen</code>) 
    en el directorio. En la mayor�a de los casos, se querr� permitir el acceso
    a m�s de una persona. Aqu� es donde la directiva 
    <code class="directive"><a href="../mod/mod_authz_groupfile.html#authgroupfile">AuthGroupFile</a></code> entra en juego.</p>

    <p>Si lo que se desea es permitir a m�s de una persona el acceso, necesitar�s
     crear un archivo de grupo que asocie los nombres de grupos con el de personas
     para permitirles el acceso. El formato de este fichero es bastante sencillo, 
     y puedes crearlo con tu editor de texto favorito. El contenido del fichero 
     se parecer� a:</p>

   <div class="example"><p><code>
     GroupName: rbowen dpitts sungo rshersey
   </code></p></div>

    <p>B�sicamente eso es la lista de miembros los cuales est�n en un mismo fichero
     de grupo en una sola linea separados por espacios.</p>

    <p>Para a�adir un usuario a tu fichero de contrase�as existente teclee:</p>

    <div class="example"><p><code>
      htpasswd /usr/local/apache/passwd/passwords dpitts
    </code></p></div>

    <p>Te responder� lo mismo que anteriormente, pero se a�adir� al fichero 
    	existente en vez de crear uno nuevo. (Es decir el flag <code>-c</code> ser� 
    	el que haga que se genere un nuevo 
    fichero de contrase�as).</p>

    <p>Ahora, tendr� que modificar su fichero <code>.htaccess</code> para que sea 
    parecido a lo siguiente:</p>

    <pre class="prettyprint lang-config">AuthType Basic
AuthName "By Invitation Only"
# Optional line:
AuthBasicProvider file
AuthUserFile "/usr/local/apache/passwd/passwords"
AuthGroupFile "/usr/local/apache/passwd/groups"
Require group GroupName</pre>


    <p>Ahora, cualquiera que est� listado en el grupo <code>GroupName</code>,
    y tiene una entrada en el fichero de <code>contrase�as</code>, se les 
    permitir� el acceso, si introducen su contrase�a correctamente.</p>

    <p>Hay otra manera de dejar entrar a varios usuarios, que es menos espec�fica.
    En lugar de crear un archivo de grupo, s�lo puede utilizar la siguiente 
    directiva:</p>

    <pre class="prettyprint lang-config">Require valid-user</pre>


    <p>Usando �sto en vez de la l�nea <code>Require user rbowen</code>
     permitir� a cualquier persona acceder, la cu�l aparece en el archivo de 
     contrase�as, y que introduzca correctamente su contrase�a. Incluso puede 
     emular el comportamiento del grupo aqu�, s�lo manteniendo un fichero de 
     contrase�as independiente para cada grupo. La ventaja de este enfoque es 
     que Apache s�lo tiene que comprobar un archivo, en lugar de dos. La desventaja 
     es que se tiene que mantener un mont�n de ficheros de contrase�a de grupo, y 
     recuerde hacer referencia al fichero correcto en la directiva
    <code class="directive"><a href="../mod/mod_authn_file.html#authuserfile">AuthUserFile</a></code>.</p>
</div><div class="top"><a href="#page-header"><img alt="top" src="../images/up.gif" /></a></div>
<div class="section">
<h2><a name="possibleproblems" id="possibleproblems">Posibles Problemas</a></h2>
    <p>Debido a la forma en que se especifica la autenticaci�n b�sica,
    su nombre de usuario y la contrase�a deben ser verificados cada vez 
    que se solicita un documento desde el servidor. Esto es, incluso si&nbsp;
    se&nbsp; vuelve a cargar la misma p�gina, y para cada imagen de la p�gina (si
&nbsp;&nbsp;&nbsp;&nbsp;provienen de un directorio protegido). Como se puede imaginar, esto
&nbsp;&nbsp;&nbsp;&nbsp;ralentiza las cosas un poco. La cantidad que ralentiza las cosas es 
    proporcional al tama�o del archivo de contrase�as, porque tiene que 
    abrir ese archivo, recorrer&nbsp;lista de usuarios hasta que llega a su nombre.
    Y tiene que hacer esto cada vez que se carga una p�gina.</p>

    <p>Una consecuencia de esto, es que hay un limite pr�ctico de cuantos 
    usuarios puedes introducir en el fichero de contrase�as. Este l�mite
    variar� dependiendo de la m�quina en la que tengas el servidor,
    pero puedes notar ralentizaciones en cuanto se metan cientos de entradas,
    y por lo tanto consideraremos entonces otro m�todo de autenticaci�n
    en ese momento.
	</p>
</div><div class="top"><a href="#page-header"><img alt="top" src="../images/up.gif" /></a></div>
<div class="section">
<h2><a name="dbmdbd" id="dbmdbd">M�todo alternativo de almacenamiento de las 
	contrase�as</a></h2>

    <p>Debido a que el almacenamiento de las contrase�as en texto plano tiene 
    	el problema mencionado anteriormente, puede que se prefiera guardar 
    	las contrase�as en otro lugar como por ejemplo una base de datos.
    	</p>

    <p>Los m�dulos <code class="module"><a href="../mod/mod_authn_dbm.html">mod_authn_dbm</a></code> y <code class="module"><a href="../mod/mod_authn_dbd.html">mod_authn_dbd</a></code> son
    dos m�dulos que hacen esto posible. En vez de seleccionar la directiva de fichero
    <code><code class="directive"><a href="../mod/mod_auth_basic.html#authbasicprovider">AuthBasicProvider</a></code> </code>, en su lugar
    se puede elegir <code>dbm</code> o <code>dbd</code> como formato de almacenamiento.</p>

    <p>Para seleccionar los ficheros de tipo dbm en vez de texto plano, podremos hacer algo parecido a lo siguiente:</p>

    <pre class="prettyprint lang-config">&lt;Directory "/www/docs/private"&gt;
    AuthName "Private"
    AuthType Basic
    AuthBasicProvider dbm
    AuthDBMUserFile "/www/passwords/passwd.dbm"
    Require valid-user
&lt;/Directory&gt;</pre>


    <p>Hay otras opciones disponibles. Consulta la documentaci�n de
    <code class="module"><a href="../mod/mod_authn_dbm.html">mod_authn_dbm</a></code> para m�s detalles.</p>
</div><div class="top"><a href="#page-header"><img alt="top" src="../images/up.gif" /></a></div>
<div class="section">
<h2><a name="multprovider" id="multprovider">Uso de m�ltiples proveedores</a></h2>

    <p>Con la introducci�n de la nueva autenticaci�n basada en un proveedor y
     una arquitectura de autorizaci�n, ya no estaremos restringidos a un �nico
     m�todo de autenticaci�n o autorizaci�n. De hecho, cualquier n�mero de 
     los proveedores pueden ser mezclados y emparejados para ofrecerle 
     exactamente el esquema que se adapte a sus necesidades. 
     En el siguiente ejemplo, veremos como ambos proveedores tanto el fichero 
     como el LDAP son usados en la autenticaci�n:
     </p>

    <pre class="prettyprint lang-config">&lt;Directory "/www/docs/private"&gt;
    AuthName "Private"
    AuthType Basic
    AuthBasicProvider file ldap
    AuthUserFile "/usr/local/apache/passwd/passwords"
    AuthLDAPURL ldap://ldaphost/o=yourorg
    Require valid-user
&lt;/Directory&gt;</pre>


    <p>En este ejemplo el fichero, que act�a como proveedor, intentar� autenticar 
    	primero al usuario. Si no puede autenticar al usuario, el proveedor del LDAP
    	ser� llamado para que realice la autenticaci�n.
    	Esto permite al �mbito de autenticaci�n ser amplio, si su organizaci�n 
    	implementa m�s de un tipo de almac�n de autenticaci�n. 
    	Otros escenarios de autenticaci�n y autorizaci�n pueden incluir la 
    	mezcla de un tipo de autenticaci�n con un tipo diferente de autorizaci�n.
    	Por ejemplo, autenticar contra un fichero de contrase�as pero autorizando
    	dicho acceso mediante el directorio del LDAP.</p>

    <p>As� como m�ltiples m�todos y proveedores de autenticaci�n pueden 
    	ser implementados, tambi�n pueden usarse m�ltiples formas de 
    	autorizaci�n.
    	En este ejemplo ambos ficheros de autorizaci�n de grupo as� como 
    	autorizaci�n de grupo mediante LDAP va a ser usado:
    </p>

    <pre class="prettyprint lang-config">&lt;Directory "/www/docs/private"&gt;
    AuthName "Private"
    AuthType Basic
    AuthBasicProvider file
    AuthUserFile "/usr/local/apache/passwd/passwords"
    AuthLDAPURL ldap://ldaphost/o=yourorg
    AuthGroupFile "/usr/local/apache/passwd/groups"
    Require group GroupName
    Require ldap-group cn=mygroup,o=yourorg
&lt;/Directory&gt;</pre>


    <p>Para llevar la autorizaci�n un poco m�s lejos, las directivas 
    	de autorizaci�n de contenedores tales como
    <code class="directive"><a href="../mod/mod_authz_core.html#requireall">&lt;RequireAll&gt;</a></code>
    and
    <code class="directive"><a href="../mod/mod_authz_core.html#requireany">&lt;RequireAny&gt;</a></code>
    nos permiten aplicar una l�gica de en qu� orden se manejar� la autorizaci�n dependiendo
    de la configuraci�n y controlada a trav�s de ella.
    Mire tambi�n <a href="../mod/mod_authz_core.html#logic">Contenedores de
    Autorizaci�n</a> para ejemplos de c�mo pueden ser aplicados.</p>

</div><div class="top"><a href="#page-header"><img alt="top" src="../images/up.gif" /></a></div>
<div class="section">
<h2><a name="beyond" id="beyond">M�s all� de la Autorizaci�n</a></h2>

    <p>El modo en que la autorizaci�n puede ser aplicada es ahora mucho m�s flexible
    	que us solo chequeo contra un almac�n de datos (contrase�as). Ordenando la 
    	l�gica y escoger la forma en que la autorizaci�n es realizada, ahora es posible 
    </p>

    <h3><a name="authandororder" id="authandororder">Aplicando la l�gica y ordenaci�n</a></h3>
        <p>Controlar el c�mo y en qu� orden se va a aplicar la autorizaci�n ha 
        	sido un misterio en el pasado. En Apache 2.2 un proveedior de autenticaci�n
        	C

        	 In Apache 2.2 a provider-based
        authentication mechanism was introduced to decouple the actual
        authentication process from authorization and supporting functionality.
        One of the side benefits was that authentication providers could be
        configured and called in a specific order which didn't depend on the
        load order of the auth module itself. This same provider based mechanism
        has been brought forward into authorization as well. What this means is
        that the <code class="directive"><a href="../mod/mod_authz_core.html#require">Require</a></code> directive
        not only specifies which authorization methods should be used, it also
        specifies the order in which they are called. Multiple authorization
        methods are called in the same order in which the
        <code class="directive"><a href="../mod/mod_authz_core.html#require">Require</a></code> directives
        appear in the configuration.</p>

        <p>With the introduction of authorization container directives
        such as
        <code class="directive"><a href="../mod/mod_authz_core.html#requireall">&lt;RequireAll&gt;</a></code>
        and
        <code class="directive"><a href="../mod/mod_authz_core.html#requireany">&lt;RequireAny&gt;</a></code>,
        the configuration also has control over when the
        authorization methods are called and what criteria determines when
        access is granted.  See
        <a href="../mod/mod_authz_core.html#logic">Authorization Containers</a>
        for an example of how they may be used to express complex
        authorization logic.</p>

        <p>By default all
        <code class="directive"><a href="../mod/mod_authz_core.html#require">Require</a></code>
        directives are handled as though contained within a
        <code class="directive"><a href="../mod/mod_authz_core.html#requireany">&lt;RequireAny&gt;</a></code>
        container directive.  In other words, if
        any of the specified authorization methods succeed, then authorization
        is granted.</p>

    

    <h3><a name="reqaccessctrl" id="reqaccessctrl">Using authorization providers for access control</a></h3>
        <p>Authentication by username and password is only part of the
        story. Frequently you want to let people in based on something
        other than who they are. Something such as where they are
        coming from.</p>

        <p>The authorization providers <code>all</code>,
        <code>env</code>, <code>host</code> and <code>ip</code> let you
        allow or deny access based on other host based criteria such as
        host name or ip address of the machine requesting a
        document.</p>

        <p>The usage of these providers is specified through the
        <code class="directive"><a href="../mod/mod_authz_core.html#require">Require</a></code> directive.
        This directive registers the authorization providers
        that will be called during the authorization stage of the request
        processing. For example:</p>

        <pre class="prettyprint lang-config">Require ip <var>address</var>
        </pre>


        <p>where <var>address</var> is an IP address (or a partial IP
        address) or:</p>

        <pre class="prettyprint lang-config">Require host <var>domain_name</var>
        </pre>


        <p>where <var>domain_name</var> is a fully qualified domain name
        (or a partial domain name); you may provide multiple addresses or
        domain names, if desired.</p>

        <p>For example, if you have someone spamming your message
        board, and you want to keep them out, you could do the
        following:</p>

        <pre class="prettyprint lang-config">&lt;RequireAll&gt;
    Require all granted
    Require not ip 10.252.46.165
&lt;/RequireAll&gt;</pre>


        <p>Visitors coming from that address will not be able to see
        the content covered by this directive. If, instead, you have a
        machine name, rather than an IP address, you can use that.</p>

        <pre class="prettyprint lang-config">&lt;RequireAll&gt;
    Require all granted
    Require not host host.example.com
&lt;/RequireAll&gt;</pre>


        <p>And, if you'd like to block access from an entire domain,
        you can specify just part of an address or domain name:</p>

        <pre class="prettyprint lang-config">&lt;RequireAll&gt;
    Require all granted
    Require not ip 192.168.205
    Require not host phishers.example.com moreidiots.example
    Require not host ke
&lt;/RequireAll&gt;</pre>


        <p>Using <code class="directive"><a href="../mod/mod_authz_core.html#requireall">&lt;RequireAll&gt;</a></code>
        with multiple <code class="directive"><a href="../mod/mod_authz_core.html#require">&lt;Require&gt;</a></code> directives, each negated with <code>not</code>,
        will only allow access, if all of negated conditions are true. In other words,
        access will be blocked, if any of the negated conditions fails.</p>

    

    <h3><a name="filesystem" id="filesystem">Access Control backwards compatibility</a></h3>
        <p>One of the side effects of adopting a provider based mechanism for
        authentication is that the previous access control directives
        <code class="directive"><a href="../mod/mod_access_compat.html#order">Order</a></code>,
        <code class="directive"><a href="../mod/mod_access_compat.html#allow">Allow</a></code>,
        <code class="directive"><a href="../mod/mod_access_compat.html#deny">Deny</a></code> and
        <code class="directive"><a href="../mod/mod_access_compat.html#satisfy">Satisfy</a></code> are no longer needed.
        However to provide backwards compatibility for older configurations, these
        directives have been moved to the <code class="module"><a href="../mod/mod_access_compat.html">mod_access_compat</a></code> module.</p>

        <div class="warning"><h3>Note</h3>
        <p>The directives provided by <code class="module"><a href="../mod/mod_access_compat.html">mod_access_compat</a></code> have
        been deprecated by <code class="module"><a href="../mod/mod_authz_host.html">mod_authz_host</a></code>.
        Mixing old directives like <code class="directive"><a href="../mod/mod_access_compat.html#order">Order</a></code>, <code class="directive"><a href="../mod/mod_access_compat.html#allow">Allow</a></code> or <code class="directive"><a href="../mod/mod_access_compat.html#deny">Deny</a></code> with new ones like
        <code class="directive"><a href="../mod/mod_authz_core.html#require">Require</a></code> is technically possible
        but discouraged. The <code class="module"><a href="../mod/mod_access_compat.html">mod_access_compat</a></code> module was created to support
        configurations containing only old directives to facilitate the 2.4 upgrade.
        Please check the <a href="../upgrading.html">upgrading</a> guide for more
        information.
        </p>
        </div>
    

</div><div class="top"><a href="#page-header"><img alt="top" src="../images/up.gif" /></a></div>
<div class="section">
<h2><a name="socache" id="socache">Authentication Caching</a></h2>
    <p>There may be times when authentication puts an unacceptable load
    on a provider or on your network.  This is most likely to affect users
    of <code class="module"><a href="../mod/mod_authn_dbd.html">mod_authn_dbd</a></code> (or third-party/custom providers).
    To deal with this, HTTPD 2.3/2.4 introduces a new caching provider
    <code class="module"><a href="../mod/mod_authn_socache.html">mod_authn_socache</a></code> to cache credentials and reduce
    the load on the origin provider(s).</p>
    <p>This may offer a substantial performance boost to some users.</p>
</div><div class="top"><a href="#page-header"><img alt="top" src="../images/up.gif" /></a></div>
<div class="section">
<h2><a name="moreinformation" id="moreinformation">More information</a></h2>
    <p>You should also read the documentation for
    <code class="module"><a href="../mod/mod_auth_basic.html">mod_auth_basic</a></code> and <code class="module"><a href="../mod/mod_authz_host.html">mod_authz_host</a></code>
    which contain some more information about how this all works.  The
    directive <code class="directive"><a href="../mod/mod_authn_core.html#authnprovideralias">&lt;AuthnProviderAlias&gt;</a></code> can also help
    in simplifying certain authentication configurations.</p>

    <p>The various ciphers supported by Apache for authentication data are
    explained in <a href="../misc/password_encryptions.html">Password
    Encryptions</a>.</p>

    <p>And you may want to look at the <a href="access.html">Access
    Control</a> howto, which discusses a number of related topics.</p>

</div></div>
<div class="bottomlang">
<p><span>Idiomas disponibles: </span><a href="../en/howto/auth.html" hreflang="en" rel="alternate" title="English">&nbsp;en&nbsp;</a> |
<a href="../es/howto/auth.html" title="Espa�ol">&nbsp;es&nbsp;</a> |
<a href="../fr/howto/auth.html" hreflang="fr" rel="alternate" title="Fran�ais">&nbsp;fr&nbsp;</a> |
<a href="../ja/howto/auth.html" hreflang="ja" rel="alternate" title="Japanese">&nbsp;ja&nbsp;</a> |
<a href="../ko/howto/auth.html" hreflang="ko" rel="alternate" title="Korean">&nbsp;ko&nbsp;</a> |
<a href="../tr/howto/auth.html" hreflang="tr" rel="alternate" title="T�rk�e">&nbsp;tr&nbsp;</a></p>
</div><div class="top"><a href="#page-header"><img src="../images/up.gif" alt="top" /></a></div><div class="section"><h2><a id="comments_section" name="comments_section">Comentarios</a></h2><div class="warning"><strong>Notice:</strong><br />This is not a Q&amp;A section. Comments placed here should be pointed towards suggestions on improving the documentation or server, and may be removed again by our moderators if they are either implemented or considered invalid/off-topic. Questions on how to manage the Apache HTTP Server should be directed at either our IRC channel, #httpd, on Freenode, or sent to our <a href="http://httpd.apache.org/lists.html">mailing lists</a>.</div>
<script type="text/javascript"><!--//--><![CDATA[//><!--
var comments_shortname = 'httpd';
var comments_identifier = 'http://httpd.apache.org/docs/trunk/howto/auth.html';
(function(w, d) {
    if (w.location.hostname.toLowerCase() == "httpd.apache.org") {
        d.write('<div id="comments_thread"><\/div>');
        var s = d.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'https://comments.apache.org/show_comments.lua?site=' + comments_shortname + '&page=' + comments_identifier;
        (d.getElementsByTagName('head')[0] || d.getElementsByTagName('body')[0]).appendChild(s);
    }
    else {
        d.write('<div id="comments_thread">Comments are disabled for this page at the moment.<\/div>');
    }
})(window, document);
//--><!]]></script></div><div id="footer">
<p class="apache">Copyright 2016 The Apache Software Foundation.<br />Licencia bajo los t�rminos de la <a href="http://www.apache.org/licenses/LICENSE-2.0">Apache License, Version 2.0</a>.</p>
<p class="menu"><a href="../mod/">M�dulos</a> | <a href="../mod/quickreference.html">Directivas</a> | <a href="http://wiki.apache.org/httpd/FAQ">Preguntas Frecuentes</a> | <a href="../glossary.html">Glosario</a> | <a href="../sitemap.html">Mapa del sitio web</a></p></div><script type="text/javascript"><!--//--><![CDATA[//><!--
if (typeof(prettyPrint) !== 'undefined') {
    prettyPrint();
}
//--><!]]></script>
</body></html>